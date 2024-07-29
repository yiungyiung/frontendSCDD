import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { Role } from '../../model/role';
import { Category } from '../../model/category';
import { Tier } from '../../model/tier';
import { User } from '../../model/user';
import { PopupService } from '../../services/PopupService/popup.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { AdminService } from '../../services/AdminService/Admin.service';
import { ChangeDetectorRef } from '@angular/core'; 
import { SubPart } from '../../Component/filter/filter.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-VendorManagement',
  templateUrl: './VendorManagement.component.html',
  styleUrls: ['./VendorManagement.component.css']
})
export class VendorManagementComponent implements OnInit {
  vendorForm!: FormGroup;
  vendors: Vendor[] = [];
  filteredVendor: Vendor[] = [];
  categories: Category[] = [];
  tiers: Tier[] = [];
  tier1Vendors: Vendor[] = [];
  private _searchQuery = '';
  get searchQuery(): string {
    return this._searchQuery;
  }
  set searchQuery(value: string) {
    this._searchQuery = value;
    this.applySearch();
  }
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pagedUsers: Vendor[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  submitted = false;
  
  selectedColumns: string[] = ['Vendor ID','Vendor Name','Vendor Address','Tier','Category','Contact Name','Contact Email','Contact Number']; 
  allColumns: string[] = ['Vendor ID','Vendor Name','Vendor Address','Tier','Category','Contact Name','Contact Email','Contact Number'];
  
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
      roleId: 4
    },
    registrationDate: new Date()
  };
  showVendorSelection = false; 
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,private authService: AuthService, private adminService: AdminService,private vendorService: VendorService, private popupService: PopupService, private modalService: ExportModalServiceService) {
    console.log('AuthService initialized:', this.authService);
    if (this.authService) {
      const token = this.authService.getToken();
      console.log('Token:', token);
    } else {
      console.error('AuthService is not available.');
    }}

  ngOnInit() {
    this.loadVendors();
    this.loadCategories();
    this.loadTiers();
    this.vendorForm = this.fb.group({
      vendorName: ['', Validators.required],
      vendorRegistration: ['', Validators.required],
      vendorAddress: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      categoryID: ['', Validators.required],
      tierID: ['', Validators.required]
    });
    
  }

  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['User Id','Vendor Id', 'Vendor Name', 'Email Id']
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '' 
    },
    {
      name: 'Vendor Status',
      type: 'checkbox',
      options: ['Active','Inactive']
    },
    {
      name: 'Category',
      type: 'checkbox',
      options: ['Critical','Non-Critical','Others']
    }
  ];
  
  isFilterVisible = false;
  searchBy = '';
  searchKeyword = '';
  selectedUserStatus: string[] = [];
  selectedVendorCategory: string[] = [];
  
  // Toggle filter visibility
  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }
  
  // Close the filter
  closeFilter(): void {
    this.isFilterVisible = false;
  }
  
  onFilterChange(event: any) {
    // Capture the search keyword and selected options
    const searchBySubPart = this.filterSubParts.find(part => part.name === 'Search By');
    console.log('search by', searchBySubPart);
    const searchKeywordSubPart = this.filterSubParts.find(part => part.name === 'Search Keyword');
    console.log('keyword',searchKeywordSubPart);
  
    if (searchBySubPart && searchKeywordSubPart) {
      this.searchBy = searchBySubPart.selectedOption || '';
      this.searchKeyword = searchKeywordSubPart.keyword || '';
    }
    this.applyFilter();
  }
  
  applyFilter() {
    // Retrieve the selected options and search keyword
    const searchBySubPart = this.filterSubParts.find(part => part.name === 'Search By');
    const searchKeywordSubPart = this.filterSubParts.find(part => part.name === 'Search Keyword');
    const vendorStatuSubPart = this.filterSubParts.find(part => part.name === 'Vendor Status');
    const vendorCategorySubPart = this.filterSubParts.find(part => part.name ==='Category');
  
    if (searchBySubPart && searchKeywordSubPart) {
      this.searchBy = searchBySubPart.selectedOption || '';
      this.searchKeyword = searchKeywordSubPart.keyword || '';
    }
  
    if (vendorStatuSubPart){
      this.selectedUserStatus = vendorStatuSubPart.selectedOptions || [];
    }

    if (vendorCategorySubPart){
      this.selectedVendorCategory = vendorCategorySubPart.selectedOptions || [];
    }
  
    this.filteredVendor = this.vendors.filter(vendor => {
      let matchesSearch = true;
      let matchesRole = true;
      let matchesStatus = true;
      let matchesCategory = true;
  
      if (this.searchBy === 'Vendor Id' && this.searchKeyword) {
        matchesSearch = vendor.vendorID?.toString().includes(this.searchKeyword) ?? false;
      } else if (this.searchBy === 'Vendor Name' && this.searchKeyword) {
        matchesSearch = vendor.vendorName.toLowerCase().includes(this.searchKeyword.toLowerCase());
      } else if (this.searchBy === 'Email Id' && this.searchKeyword) {
        matchesSearch = vendor.user.email.toLowerCase().includes(this.searchKeyword.toLowerCase());
      } else if (this.searchBy === 'User Id' && this.searchKeyword){
        matchesSearch = vendor.userID?.toString().includes(this.searchKeyword) ?? false;
      }
  
      if (this.selectedUserStatus.length >0){
        const isActive = vendor.user.isActive ? 'Active' : 'Inactive';
        matchesStatus = this.selectedUserStatus.includes(isActive);
      }
  
      if(this.selectedVendorCategory.length>0){
        matchesCategory = this.selectedVendorCategory.includes(vendor.category!.categoryName);
      }

      return matchesSearch && matchesRole && matchesStatus && matchesCategory;
    });
  
    this.totalItems = this.filteredVendor.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.vendorForm.invalid) {
      return;
    }
  
    // Populate newVendor with form values
    this.newVendor.vendorRegistration = this.vendorForm.get('vendorRegistration')?.value || '';
    this.newVendor.vendorName = this.vendorForm.get('vendorName')?.value || '';
    this.newVendor.vendorAddress = this.vendorForm.get('vendorAddress')?.value || '';
    this.newVendor.user.name = this.vendorForm.get('contactName')?.value || '';
    this.newVendor.user.email = this.vendorForm.get('email')?.value || '';
    this.newVendor.user.contact_Number = this.vendorForm.get('contactNumber')?.value || '';
    this.newVendor.categoryID = Number(this.vendorForm.get('categoryID')?.value) || 0;
    this.newVendor.tierID = Number(this.vendorForm.get('tierID')?.value) || 0;
  
    const vendorPayload: Vendor = {
      vendorRegistration: this.newVendor.vendorRegistration,
      vendorName: this.newVendor.vendorName,
      vendorAddress: this.newVendor.vendorAddress,
      tierID: this.newVendor.tierID,
      user: {
        email: this.newVendor.user.email,
        name: this.newVendor.user.name,
        contact_Number: this.newVendor.user.contact_Number,
        roleId: 4,  // Assuming roleId is static for this example
        isActive: this.newVendor.user.isActive
      },
      categoryID: this.newVendor.categoryID,
      parentVendorIDs: this.newVendor.parentVendorIDs!.map(Number)
    };
  
    this.addVendor(vendorPayload);
  }
  

  toggleVendorSelection() {
    this.showVendorSelection = !this.showVendorSelection;
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
  
  get filteredVendors() {
    return this.tier1Vendors.filter(vendor =>
      vendor.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  loadVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe(
      serverVendors => {
        this.vendors = serverVendors.map(serverVendor => this.mapServerUserToUser(serverVendor));
        this.vendors = serverVendors;
        this.filteredVendor = this.vendors;
        this.totalItems = this.vendors.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedUsers();
      },
      error => console.error('Error loading vendors:', error)
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
    this.pagedUsers = this.vendors.slice(startIndex, endIndex);
  }

  loadCategories() {
    const token = this.authService.getToken();
    this.vendorService.getCategories(token).subscribe(
      categories => {
        this.categories = categories;
        console.log('Loaded categories:', this.categories);
      },
      error => console.error('Error loading categories:', error)
    );
  }

  loadTiers() {
    const token = this.authService.getToken();
    this.vendorService.getTiers(token).subscribe(
      tiers => {
        this.tiers = tiers;
        console.log('Loaded tiers:', this.tiers);
      },
      error => console.error('Error loading tiers:', error)
    );
  }

  filteredTier1Vendors: Vendor[] = [];

  onTierChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tierID = Number(selectElement.value);
    if (tierID > 1) {
      const token = this.authService.getToken();
      this.vendorService.getVendorsByTier(token, tierID - 1).subscribe(
        vendors => {
          this.tier1Vendors = vendors;
          this.filteredTier1Vendors = vendors;
          this.applySearch();
        },
        error => console.error('Error loading tier 1 vendors:', error)
      );
    } else {
      this.tier1Vendors = [];
      this.filteredTier1Vendors = [];
    }
  }

  applySearch() {
    this.filteredTier1Vendors = this.tier1Vendors.filter(vendor =>
      vendor.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addVendor(vendordata: Vendor) {
    const token = this.authService.getToken();
    console.log('Adding vendor with payload:', vendordata);
    this.vendorService.addVendor(token, vendordata).subscribe(
      addedVendor => {
        this.vendors.push(addedVendor);
        this.totalItems = this.vendors.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedUsers();
        this.resetForm();
        this.popupService.showPopup('User added successfully', '#0F9D09');
      },
      error => {
        console.error('Error adding vendor:', error);
        this.popupService.showPopup('Failed to add user. Please try again.', '#C10000');
      }
    )
  }

  resetForm() {
    this.vendorForm.reset();
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
        roleId: 4
      },
      registrationDate: new Date()
    };
    this.tier1Vendors = [];
    this.applySearch(); // Re-apply search to update the displayed vendors
  }
  
  
  openExportModal() {
    const data = this.vendors.map(vendor => ({
      'Vendor ID': vendor.vendorID,
      'Vendor Name': vendor.vendorName,
      'Vendor Address': vendor.vendorAddress,
      'Tier': vendor.tier?.tierName,
      'Category': vendor.category?.categoryName,
      'Contact Name': vendor.user?.name,
      'Contact Email': vendor.user?.email,
      'Contact Number': vendor.user?.contact_Number,
    }));
    
    this.modalService.setDataAndColumns(data, this.selectedColumns);
    this.modalService.showExportModal();
  }

  private getRoleFromRoleId(roleId: number): Role {
    switch(roleId) {
      case 1: return Role.Admin;
      case 2: return Role.Manager;
      case 3: return Role.Analyst;
      case 4: return Role.Vendor;
      default: throw new Error('Invalid role ID');
    }
  }

  private mapServerUserToUser(serverUser: any): Vendor {
    console.log('Mapping server user to vendor:', serverUser);
    console.log('please::',serverUser.user.isActive);
    return {
      vendorID: serverUser.vendorID,
      vendorName: serverUser.vendorName, 
      vendorAddress: serverUser.vendorAddress, 
      tierID: serverUser.tierID, 
      categoryID:serverUser.categoryID,
      vendorRegistration: serverUser.vendorRegistration,
      user: {
        isActive: serverUser.user.isActive,
        email: serverUser.user.email,
        name: serverUser.user.name,
        contact_Number: serverUser.user.contact_Number,
        roleId: serverUser.user.roleId
      },
      userID: serverUser.userId,
    };
  }

  toggleVendorStatus(vendor: Vendor){
    if (!this.authService) {
    console.error('AuthService is not initialized.');
    return;
  }

  if (this.authService) {
    const token = this.authService.getToken();
    console.log('Tokennnn:', token);
  } else {
    console.error('AuthService is not available.');
  }

  if (!vendor || !vendor.user) {
    console.error('Vendor or vendor.user is undefined.');
    return;
  }

    console.log("workinhgggggg")
    const newStatus = !vendor.user.isActive;
    console.log(vendor.user.isActive);
    const token = this.authService.getToken();
    vendor.user.isActive= !vendor.user.isActive;
    const usser : User = {
    ...vendor.user
  };
    this.adminService.updateUser(usser, token).subscribe(
      response => {
        const index = this.vendors.findIndex(u => u.user.userId === response.userId);
        if (index !== -1) {
          this.vendors[index] = this.mapServerUserToUser(response);
          this.updatePagedUsers();
          this.cdr.detectChanges(); 
          this.loadVendors();
        }
      },
      error => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
        vendor.user.isActive = !newStatus;
        this.cdr.detectChanges(); 
      }
    );
  }
}
