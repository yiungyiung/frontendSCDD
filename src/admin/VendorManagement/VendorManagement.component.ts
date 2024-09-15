import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { Category } from '../../model/category';
import { Tier } from '../../model/tier';
import { User } from '../../model/user';
import { PopupService } from '../../services/PopupService/popup.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { AdminService } from '../../services/AdminService/Admin.service';
import { ChangeDetectorRef } from '@angular/core';
import { SubPart } from '../../Component/filter/filter.component';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../services/FilterService/Filter.service';
import { DataFetchService } from '../../services/DataFetchService/DataFetch.service';

@Component({
  selector: 'app-VendorManagement',
  templateUrl: './VendorManagement.component.html',
  styleUrls: ['./VendorManagement.component.scss'],
})
export class VendorManagementComponent implements OnInit {
  selectedVendor: Vendor | null = null;
  vendorForm!: FormGroup;
  vendors: Vendor[] = [];
  filteredVendor: Vendor[] = [];
  categories: Category[] = [];
  tiers: Tier[] = [];
  isFilterVisible = false;
  itemsPerPageOptions = [5, 10, 20, 50];
  pagedUsers: Vendor[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  showFileUpload = false;
  failedUsersUpload: string[] = [];
  vendorForExport: Vendor[] = [];
  selectedColumns = [
    'Vendor ID', 'Vendor Name', 'Vendor Address', 'Tier', 'Category',
    'Contact Name', 'Contact Email', 'Contact Number',
  ];
  allColumns = this.selectedColumns;
  csvHeaders = [
    'Contact Number', 'Contact Name', 'Contact Email', 'Vendor Registration',
    'Category', 'Tier', 'Vendor Address', 'Vendor Name',
  ];
  newVendor: Vendor = this.initNewVendor();

  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['User Id', 'Vendor Id', 'Vendor Name', 'Email Id'],
    },
    { name: 'Search Keyword', type: 'searchBar', keyword: '' },
    { name: 'Vendor Status', type: 'checkbox', options: ['Active', 'Inactive'] },
    { name: 'Category', type: 'checkbox', options: [] },
  ];

  constructor(
    private filterService: FilterService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private adminService: AdminService,
    private vendorService: VendorService,
    private popupService: PopupService,
    private modalService: ExportModalServiceService,
    private dataFetchService: DataFetchService
  ) {}

  ngOnInit() {
    this.loadVendors();
    this.loadCategories();
    this.loadTiers();
  }

  handleUpdatedVendor(vendor: Vendor) {
    this.vendorForExport.push(vendor);
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  closeFilter() {
    this.isFilterVisible = false;
  }

  isFilterApplied(): boolean {
    return ['Search By', 'Role', 'Vendor Status', 'Category'].some(name => {
      const part = this.filterSubParts.find(p => p.name === name);
      return part && (part.selectedOption || (part.selectedOptions && part.selectedOptions.length > 0));
    });
  }

  onFilterChange() {
    this.filteredVendor = this.filterService.applyFilter(this.vendors, this.prepareFilters());
    this.updatePagination();
  }

  prepareFilters() {
    const filters = [];
    const searchByMap: { [key: string]: (vendor: Vendor) => any } = {
      'Vendor Id': (vendor: Vendor) => vendor.vendorID,
      'Vendor Name': (vendor: Vendor) => vendor.vendorName,
      'Email Id': (vendor: Vendor) => vendor.user?.email,
      'User Id': (vendor: Vendor) => vendor.userID,
    };
  
    const searchBy = this.filterSubParts.find(p => p.name === 'Search By');
    const searchKeyword = this.filterSubParts.find(p => p.name === 'Search Keyword');
    if (searchBy?.selectedOption && searchKeyword) {
      const searchByKey = searchBy.selectedOption as keyof typeof searchByMap;
      filters.push({
        partName: 'Search By',
        value: searchKeyword.keyword || '',
        column: searchByMap[searchByKey],
        exactMatch: false,
      });
    }
  
    ['Vendor Status', 'Category'].forEach(name => {
      const part = this.filterSubParts.find(p => p.name === name);
      if (part?.selectedOptions?.length) {
        filters.push({
          partName: name,
          value: part.selectedOptions,
          column: name === 'Vendor Status'
            ? (vendor: Vendor) => vendor.user?.isActive ? 'Active' : 'Inactive'
            : (vendor: Vendor) => vendor.category?.categoryName ?? '',
        });
      }
    });
  
    return filters;
  }

  selectVendorForUpdate(vendor: Vendor) {
    this.selectedVendor = { ...vendor };
    this.vendorForm.patchValue({
      contactName: vendor.user.name,
      email: vendor.user.email,
      contactNumber: vendor.user.contact_Number,
    });
  }

  toggleSelection(vendorID: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const index = this.newVendor.parentVendorIDs!.indexOf(vendorID);
    if (isChecked && index === -1) {
      this.newVendor.parentVendorIDs!.push(vendorID);
    } else if (!isChecked && index !== -1) {
      this.newVendor.parentVendorIDs!.splice(index, 1);
    }
  }

  toggleVendorStatus(vendor: Vendor) {
    if (!vendor?.user) return;
    const updatedUser: User = {
      ...vendor.user,
      isActive: !vendor.user.isActive,
    };
    this.adminService.updateUser(updatedUser, this.authService.getToken()).subscribe(
      response => {
        const index = this.vendors.findIndex(v => v.userID === response.userId);
        if (index !== -1) {
          this.vendors[index].user = response;
          this.updatePagedUsers();
          this.cdr.detectChanges();
          this.loadVendors();
        }
      },
      error => {
        console.error('Error updating user:', error);
        this.popupService.showPopup('Failed to update user. Please try again.', '#C10000');
        vendor.user.isActive = !updatedUser.isActive;
        this.cdr.detectChanges();
      }
    );
  }

  loadVendors() {
    this.dataFetchService.loadVendors().subscribe(
      vendors => {
        this.vendors = vendors.map(v => this.dataFetchService.mapServerVendorToVendor(v));
        this.filteredVendor = this.vendors;
        this.updatePagination();
      },
      error => console.error('Error loading vendors:', error)
    );
  }

  updatePagination() {
    this.totalItems = this.filteredVendor.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedUsers();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.updatePagination();
  }

  updatePagedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedUsers = this.filteredVendor.slice(startIndex, startIndex + this.itemsPerPage);
  }

  loadCategories() {
    this.dataFetchService.loadCategories().subscribe(
      categories => {
        this.categories = categories;
        const categoryFilter = this.filterSubParts.find(p => p.name === 'Category');
        if (categoryFilter) {
          categoryFilter.options = this.categories.map(c => c.categoryName);
        }
      },
      error => console.error('Error loading categories:', error)
    );
  }

  loadTiers() {
    this.dataFetchService.loadTiers().subscribe(
      tiers => this.tiers = tiers,
      error => console.error('Error loading tiers:', error)
    );
  }

  onVendorAdded(vendor: Vendor) {
    this.vendors.push(vendor);
    this.updatePagination();
  }

  onVendorUpdated(updatedVendor: Vendor) {
    const index = this.vendors.findIndex(v => v.vendorID === updatedVendor.vendorID);
    if (index !== -1) {
      this.vendors[index] = updatedVendor;
      this.updatePagedUsers();
    }
    this.selectedVendor = null;
  }

  openExportModal() {
    const data = this.vendors.map(v => ({
      'Vendor ID': v.vendorID,
      'Vendor Name': v.vendorName,
      'Vendor Address': v.vendorAddress,
      'Tier': v.tier?.tierName,
      'Category': v.category?.categoryName,
      'Contact Name': v.user?.name,
      'Contact Email': v.user?.email,
      'Contact Number': v.user?.contact_Number,
    }));
    this.modalService.setDataAndColumns(data, this.selectedColumns);
    this.modalService.showExportModal();
  }

  resetNewVendor() {
    this.newVendor = this.initNewVendor();
  }

  resetSelectedVendor() {
    this.selectedVendor = null;
    this.resetNewVendor();
  }

  toggleFileUpload() {
    this.showFileUpload = !this.showFileUpload;
  }

  onFileParsed(parsedData: any[]) {
    this.showFileUpload = false;
    this.failedUsersUpload = [];
    const token = this.authService.getToken();

    Promise.all(parsedData.map(data => this.processVendorData(data, token)))
      .then(results => {
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.length - successCount;
        this.failedUsersUpload = results.filter(r => !r.success).map(r => r.name);
        this.loadVendors();
        this.showSummaryPopup(successCount, failureCount);
      });
  }

  private async processVendorData(vendorData: any, token: string): Promise<{ success: boolean; name: string }> {
    try {
      const newVendor = await this.dataFetchService.mapServerVendorToVendorForFileUpload(vendorData);
      await this.vendorService.addVendor(token, newVendor).toPromise();
      return { success: true, name: vendorData['Name'] };
    } catch (error) {
      console.error('Error adding vendor from file:', error);
      return { success: false, name: vendorData['Name'] };
    }
  }

  private showSummaryPopup(successCount: number, failureCount: number) {
    this.popupService.showPopup(`${successCount} users added successfully, ${failureCount} could not be added.`, '#0F9D09');
  }

  onCancelFileUpload() {
    this.showFileUpload = false;
  }

  private initNewVendor(): Vendor {
    return {
      vendorRegistration: '',
      vendorName: '',
      vendorAddress: '',
      tierID: 0,
      categoryID: 0,
      parentVendorIDs: [],
      user: {
        isActive: true,
        email: '',
        name: '',
        contact_Number: '',
        roleId: 4,
      },
      registrationDate: new Date(),
    };
  }
}