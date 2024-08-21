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
import { FilterService } from '../../services/FilterService/Filter.service';

@Component({
  selector: 'app-VendorManagement',
  templateUrl: './VendorManagement.component.html',
  styleUrls: ['./VendorManagement.component.css']
})
export class VendorManagementComponent implements OnInit {
  selectedVendor: Vendor | null = null;
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
  filteredTier1Vendors: Vendor[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  submitted = false;
  
  selectedColumns: string[] = ['Vendor ID','Vendor Name','Vendor Address','Tier','Category','Contact Name','Contact Email','Contact Number']; 
  allColumns: string[] = ['Vendor ID','Vendor Name','Vendor Address','Tier','Category','Contact Name','Contact Email','Contact Number'];
  showFileUpload: boolean = false;
  failedUsersUpload: string[] = [];
  csvHeaders: string[] = ['Contact Number','Contact Name','Contact Email','vendor Registration','Category','Tier','Vendor Address','Vendor Name'];

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
  constructor(private fb: FormBuilder, private filterService: FilterService,private cdr: ChangeDetectorRef,private authService: AuthService, private adminService: AdminService,private vendorService: VendorService, private popupService: PopupService, private modalService: ExportModalServiceService) {
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
  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(part => part.name === 'Search By');
    const roleIdSubPart = this.filterSubParts.find(part => part.name === 'Role');
    const userStatusSubPart = this.filterSubParts.find(part => part.name === 'Vendor Status');
    const vendorCategorySubPart = this.filterSubParts.find(part => part.name ==='Category');
  
    return (
      !!(searchBySubPart && searchBySubPart.selectedOption) ||
      !!(roleIdSubPart && roleIdSubPart.selectedOptions && roleIdSubPart.selectedOptions.length > 0) ||
      !!(userStatusSubPart && userStatusSubPart.selectedOptions && userStatusSubPart.selectedOptions.length > 0) ||
      !!(vendorCategorySubPart && vendorCategorySubPart.selectedOptions && vendorCategorySubPart.selectedOptions.length > 0)
    );
  }
  
  onFilterChange(event: any) {
    this.filteredVendor = this.filterService.applyFilter(this.vendors, this.filterSubParts, {
      'Vendor Id': (vendor) => vendor.vendorID,
      'Vendor Name': (vendor) => vendor.vendorName,
      'Email Id': (vendor) => vendor.user.email, // Adjusted for nested property
      'User Id': (vendor) => vendor.userID
    });
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
      contactNumber: vendor.user.contact_Number
    });
  }

  updateVendor(): void {
    
    if (this.vendorForm.invalid || !this.selectedVendor) {
      console.log("Form is invalid or selectedVendor is null");
      return;
    }
    const token = this.authService.getToken();
    alert('Button clicked!');
    const updatedUser: User = {
      ...this.selectedVendor.user,
      name: this.vendorForm.get('contactName')?.value,
      email: this.vendorForm.get('email')?.value,
      contact_Number: this.vendorForm.get('contactNumber')?.value,
    };
    
    this.adminService.updateUser(updatedUser, token).subscribe(
      response => {
        const index = this.vendors.findIndex(v => v.userID === response.userId);
        if (index !== -1) {
          this.vendors[index].user = response;
          this.updatePagedUsers();
          this.resetSelectedVendor();
          
          this.popupService.showPopup('Vendor user details updated successfully', '#0F9D09');
        }
      },
      error => {
        console.error('Error updating vendor user details:', error);
        this.popupService.showPopup('Failed to update vendor user details. Please try again.', '#C10000');
      }
    );
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
    this.pagedUsers = this.filteredVendor.slice(startIndex, endIndex);
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
        this.filteredVendor = this.vendors; // Update filteredVendor
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
    console.log('please::', serverUser.user.isActive);
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
        roleId: serverUser.user.roleId
      },
    };
  }

  toggleVendorStatus(vendor: Vendor) {
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
  
    // Update the user's isActive status
    const updatedUser: User = {
      userId: vendor.user.userId,
      isActive: !vendor.user.isActive,
      email: vendor.user.email,
      name: vendor.user.name,
      contact_Number: vendor.user.contact_Number,
      roleId: vendor.user.roleId
    };
  
    this.adminService.updateUser(updatedUser, token).subscribe(
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
        alert('Failed to update user. Please try again.');
        vendor.user.isActive = !newStatus;
        this.cdr.detectChanges(); 
      }
    );
  }

  resetNewVendor() {
    this.newVendor= {
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
  }

  resetSelectedVendor() {
    this.selectedVendor = null;
    this.resetNewVendor();
  }

  get vendorName(): string {
    return this.selectedVendor ? this.selectedVendor.vendorName : this.newVendor.vendorName;
  }
  set vendorName(value: string) {
    if (this.selectedVendor) {
      this.selectedVendor.vendorName = value;
    } else {
      this.newVendor.vendorName = value;
    }
  }

  toggleFileUpload(): void {
    console.log("visbility triggered");
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
            this.triggerNotification(successCount, failureCount);
            this.showSummaryPopup(successCount, failureCount);
          }
        });
    });
  }
  
  private async processVendorData(vendorData: any, token: string): Promise<void> {
    try {
      const newVendor = this.mapServerUserToUserForFileUpload(vendorData);
      console.log('newvendporrrrrr',newVendor);
      await this.vendorService.addVendor(token,newVendor).toPromise();

      this.vendors.push(newVendor);
      console.log('Vendor added from file successfully:', newVendor);
    } catch (error) {
      console.error('Error adding vendor from file:', error);
      this.failedUsersUpload.push(vendorData['Name'] || 'Unknown Vendor');
    }
  }
  
  
  private showSummaryPopup(successCount: number, failureCount: number): void {
    const message = `${successCount} users added successfully, ${failureCount} could not be added.`;
    this.popupService.showPopup(message,'#0F9D09');
  }

  onCancelFileUpload(): void {
    this.showFileUpload = false;
  }

  mapServerUserToUserForFileUpload(userData: any): Vendor {
    return {
      vendorID: userData['vendorID'],
      vendorName: userData['Vendor Name'], 
      vendorAddress: userData['Vendor Address'], 
      tierID: userData['Tier'], 
      categoryID:userData['Category'],
      vendorRegistration: userData['vendor Registration'],
      user: {
        isActive: userData.user.isActive,
        email: userData['Contact Email'],
        name: userData['Contact Name'],
        contact_Number: userData['Contact Number'],
        roleId:4
      },
      userID: userData.userId,
    };
  }

  private triggerNotification(successCount: number, failureCount: number): void {
    // Triggering notification for failed users
    if (failureCount > 0) {
      // Add any additional logic if necessary
      console.log('Notification triggered for failed users');
    }
  }

}
