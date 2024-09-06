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
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pagedUsers: Vendor[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  allTierdata: Tier[] = [];
  allcategorydata: Category[] = [];
  showFileUpload: boolean = false;
  failedUsersUpload: string[] = [];
  vendorForExport: Vendor[] = [];
  selectedColumns: string[] = [
    'Vendor ID',
    'Vendor Name',
    'Vendor Address',
    'Tier',
    'Category',
    'Contact Name',
    'Contact Email',
    'Contact Number',
  ];
  allColumns: string[] = [
    'Vendor ID',
    'Vendor Name',
    'Vendor Address',
    'Tier',
    'Category',
    'Contact Name',
    'Contact Email',
    'Contact Number',
  ];
  csvHeaders: string[] = [
    'Contact Number',
    'Contact Name',
    'Contact Email',
    'vendor Registration',
    'Category',
    'Tier',
    'Vendor Address',
    'Vendor Name',
  ];
  newVendor: Vendor = {
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
  constructor(
    private filterService: FilterService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private adminService: AdminService,
    private vendorService: VendorService,
    private popupService: PopupService,
    private modalService: ExportModalServiceService,
    private dataFetchService: DataFetchService
  ) {
    if (this.authService) {
      const token = this.authService.getToken();
      console.log('Token:', token);
    } else {
      console.error('AuthService is not available.');
    }
  }
  ngOnInit() {
    this.loadVendors();
    this.loadCategories();
    this.loadTiers();
  }
  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['User Id', 'Vendor Id', 'Vendor Name', 'Email Id'],
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '',
    },
    {
      name: 'Vendor Status',
      type: 'checkbox',
      options: ['Active', 'Inactive'],
    },
    {
      name: 'Category',
      type: 'checkbox',
      options: ['Critical', 'Non-Critical', 'Others'],
    },
  ];
  handleUpdatedVendor(vendor: Vendor): void {
    this.vendorForExport.push(vendor);
  }
  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }
  closeFilter(): void {
    this.isFilterVisible = false;
  }
  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    const roleIdSubPart = this.filterSubParts.find(
      (part) => part.name === 'Role'
    );
    const userStatusSubPart = this.filterSubParts.find(
      (part) => part.name === 'Vendor Status'
    );
    const vendorCategorySubPart = this.filterSubParts.find(
      (part) => part.name === 'Category'
    );

    return (
      !!(searchBySubPart && searchBySubPart.selectedOption) ||
      !!(
        roleIdSubPart &&
        roleIdSubPart.selectedOptions &&
        roleIdSubPart.selectedOptions.length > 0
      ) ||
      !!(
        userStatusSubPart &&
        userStatusSubPart.selectedOptions &&
        userStatusSubPart.selectedOptions.length > 0
      ) ||
      !!(
        vendorCategorySubPart &&
        vendorCategorySubPart.selectedOptions &&
        vendorCategorySubPart.selectedOptions.length > 0
      )
    );
  }
  onFilterChange(event: any) {
    this.filteredVendor = this.filterService.applyFilter(
      this.vendors,
      this.filterSubParts,
      {
        'Vendor Id': (vendor) => vendor.vendorID,
        'Vendor Name': (vendor) => vendor.vendorName,
        'Email Id': (vendor) => vendor.user.email,
        'User Id': (vendor) => vendor.userID,
      }
    );
    this.totalItems = this.filteredVendor.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedUsers();
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
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;

    if (isChecked) {
      if (!this.newVendor.parentVendorIDs!.includes(vendorID)) {
        this.newVendor.parentVendorIDs!.push(vendorID);
      }
    } else {
      const index = this.newVendor.parentVendorIDs!.indexOf(vendorID);
      if (index !== -1) {
        this.newVendor.parentVendorIDs!.splice(index, 1);
      }
    }
  }
  toggleVendorStatus(vendor: Vendor) {
    if (!this.authService) {
      console.error('AuthService is not initialized.');
      return;
    }
    if (this.authService) {
      const token = this.authService.getToken();
    } else {
      console.error('AuthService is not available.');
    }
    if (!vendor || !vendor.user) {
      console.error('Vendor or vendor.user is undefined.');
      return;
    }
    const newStatus = !vendor.user.isActive;
    const token = this.authService.getToken();
    const updatedUser: User = {
      userId: vendor.user.userId,
      isActive: !vendor.user.isActive,
      email: vendor.user.email,
      name: vendor.user.name,
      contact_Number: vendor.user.contact_Number,
      roleId: vendor.user.roleId,
    };
    this.adminService.updateUser(updatedUser, token).subscribe(
      (response) => {
        const index = this.vendors.findIndex(
          (v) => v.userID === response.userId
        );
        if (index !== -1) {
          this.vendors[index].user = response;
          this.updatePagedUsers();
          this.cdr.detectChanges();
          this.loadVendors();
        }
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        vendor.user.isActive = !newStatus;
        this.cdr.detectChanges();
      }
    );
  }
  loadVendors() {
    this.dataFetchService.loadVendors().subscribe(
      (vendors) => {
        this.vendors = vendors.map((vendor) =>
          this.mapServerUserToUser(vendor)
        );
        this.filteredVendor = this.vendors;
        this.totalItems = this.vendors.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedUsers();
      },
      (error) => console.error('Error loading vendors:', error)
    );
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedUsers();
  }
  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedUsers();
  }
  updatePagedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedUsers = this.filteredVendor.slice(startIndex, endIndex);
  }
  loadCategories() {
    this.dataFetchService.loadCategories().subscribe(
      (categories) => (this.categories = categories),
      (error) => console.error('Error loading categories:', error)
    );
  }
  loadTiers() {
    this.dataFetchService.loadTiers().subscribe(
      (tiers) => (this.tiers = tiers),
      (error) => console.error('Error loading tiers:', error)
    );
  }
  onVendorAdded(vendor: Vendor) {
    this.vendors.push(vendor);
    this.totalItems = this.vendors.length;
    this.updatePagedUsers();
  }
  onVendorUpdated(updatedVendor: Vendor) {
    const index = this.vendors.findIndex(
      (v) => v.vendorID === updatedVendor.vendorID
    );
    if (index !== -1) {
      this.vendors[index] = updatedVendor;
      this.updatePagedUsers();
    }
    this.selectedVendor = null;
  }
  openExportModal() {
    const data = this.vendors.map((vendor) => ({
      'Vendor ID': vendor.vendorID,
      'Vendor Name': vendor.vendorName,
      'Vendor Address': vendor.vendorAddress,
      Tier: vendor.tier?.tierName,
      Category: vendor.category?.categoryName,
      'Contact Name': vendor.user?.name,
      'Contact Email': vendor.user?.email,
      'Contact Number': vendor.user?.contact_Number,
    }));

    this.modalService.setDataAndColumns(data, this.selectedColumns);
    this.modalService.showExportModal();
  }
  private mapServerUserToUser(serverUser: any): Vendor {
    return {
      vendorID: serverUser.vendorID,
      vendorName: serverUser.vendorName,
      vendorAddress: serverUser.vendorAddress,
      tierID: serverUser.tierID,
      categoryID: serverUser.categoryID,
      vendorRegistration: serverUser.vendorRegistration,
      userID: serverUser.userID, // Use the correct property name
      user: {
        userId: serverUser.user.userId, // Use the correct property name
        isActive: serverUser.user.isActive,
        email: serverUser.user.email,
        name: serverUser.user.name,
        contact_Number: serverUser.user.contact_Number,
        roleId: serverUser.user.roleId,
      },
    };
  }
  resetNewVendor() {
    this.newVendor = {
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
  resetSelectedVendor() {
    this.selectedVendor = null;
    this.resetNewVendor();
  }
  toggleFileUpload(): void {
    this.showFileUpload = !this.showFileUpload;
  }
  onFileParsed(parsedData: any[]): void {
    this.showFileUpload = false;
    console.log('Parsed data received:', parsedData);
    const token = this.authService.getToken();
    this.failedUsersUpload = [];
    let successCount = 0;
    let failureCount = 0;
    parsedData.forEach((vendorData, index) => {
      this.processVendorData(vendorData, token)
        .then(() => successCount++)
        .catch(() => failureCount++)
        .finally(() => {
          if (index === parsedData.length - 1) {
            this.loadVendors();
            this.showSummaryPopup(successCount, failureCount);
          }
        });
    });
  }
  private async processVendorData(
    vendorData: any,
    token: string
  ): Promise<void> {
    try {
      const newVendor = await this.mapServerUserToUserForFileUpload(vendorData);
      await this.vendorService.addVendor(token, newVendor).toPromise();
      this.vendors.push(newVendor);
    } catch (error) {
      console.error('Error adding vendor from file:', error);
      this.failedUsersUpload.push(vendorData['Name'] || 'Unknown Vendor');
    }
  }
  private showSummaryPopup(successCount: number, failureCount: number): void {
    const message = `${successCount} users added successfully, ${failureCount} could not be added.`;
    this.popupService.showPopup(message, '#0F9D09');
  }
  onCancelFileUpload(): void {
    this.showFileUpload = false;
  }
  async getTierIdFromName(tierName: string): Promise<number> {
    const token = this.authService.getToken();
    try {
      const tiers = await this.vendorService.getTiers(token).toPromise();
      if (!tiers) {
        throw new Error('Tiers data is undefined');
      }
      const matchedTier = tiers.find(
        (tier) => tier.tierName.toLowerCase() === tierName.toLowerCase()
      );
      if (matchedTier) {
        return matchedTier.tierId;
      } else {
        throw new Error('Tier not found');
      }
    } catch (error) {
      console.error('Error loading tiers:', error);
      throw error;
    }
  }
  async getCategoryIdFromName(categoryName: string): Promise<number> {
    const token = this.authService.getToken();
    try {
      const categories = await this.vendorService
        .getCategories(token)
        .toPromise();
      if (!categories) {
        throw new Error('Categories data is undefined');
      }
      const matchedCategory = categories.find(
        (category) =>
          category.categoryName.toLowerCase() === categoryName.toLowerCase()
      );
      if (matchedCategory) {
        return matchedCategory.categoryID;
      } else {
        throw new Error('Category not found');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      throw error;
    }
  }
  async mapServerUserToUserForFileUpload(userData: any): Promise<Vendor> {
    try {
      const tierID = await this.getTierIdFromName(userData['Tier']);
      const categoryID = await this.getCategoryIdFromName(userData['Category']);

      return {
        vendorName: userData['Vendor Name'],
        vendorAddress: userData['Vendor Address'],
        tierID: tierID,
        categoryID: categoryID,
        vendorRegistration: userData['vendor Registration'],
        parentVendorIDs: this.newVendor.parentVendorIDs!.map(Number),
        user: {
          isActive: this.newVendor.user.isActive,
          email: userData['Contact Email'],
          name: userData['Contact Name'],
          contact_Number: userData['Contact Number'],
          roleId: 4,
        },
      };
    } catch (error) {
      console.error('Error processing user data:', error);
      throw error;
    }
  }
}
