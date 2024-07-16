import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { Category } from '../../model/category';
import { Tier } from '../../model/tier';
import { PopupService } from '../../services/PopupService/popup.service';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';

@Component({
  selector: 'app-VendorManagement',
  templateUrl: './VendorManagement.component.html',
  styleUrls: ['./VendorManagement.component.css']
})
export class VendorManagementComponent implements OnInit {
  vendors: Vendor[] = [];
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
  constructor(private vendorService: VendorService, private authService: AuthService, private popupService: PopupService,private modalService: ExportModalServiceService) {}

  ngOnInit() {
    this.loadVendors();
    this.loadCategories();
    this.loadTiers();
  }

  toggleVendorSelection() {
    this.showVendorSelection = !this.showVendorSelection;
  }

  toggleSelection(vendorID: number, event: Event) {  // Changed vendorID type to number and added event parameter
    const inputElement = event.target as HTMLInputElement;  // Cast event target to HTMLInputElement
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
      serverVendors => this.vendors = serverVendors,
      error => console.error('Error loading vendors:', error)
    );
    this.totalItems = this.vendors.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePagedUsers();
  }
  updatePagedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedUsers = this.vendors.slice(start, end);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }
  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(target.value);
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePagedUsers();
  }
  paginationText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start} - ${end} of ${this.totalItems}`;
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
        this.filteredTier1Vendors = vendors; // Initialize filteredTier1Vendors
        this.applySearch(); // Apply search after populating vendors
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
  addVendor() {
    const token = this.authService.getToken();
    const vendorPayload: Vendor = {
      vendorRegistration: this.newVendor.vendorRegistration,
      vendorName: this.newVendor.vendorName,
      vendorAddress: this.newVendor.vendorAddress,
      tierID: Number(this.newVendor.tierID),
      user: {
        email: this.newVendor.user.email,
        name: this.newVendor.user.name,
        contact_Number: this.newVendor.user.contact_Number,
        roleId: 4,
        isActive: this.newVendor.user.isActive
      },
      categoryID: Number(this.newVendor.categoryID),
      parentVendorIDs: this.newVendor.parentVendorIDs!.map(Number)
    };

    console.log('Adding vendor with payload:', vendorPayload);
    this.vendorService.addVendor(token, vendorPayload).subscribe(
      addedVendor => {
        this.vendors.push(addedVendor);
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
      }
    };
    this.tier1Vendors = [];
  }
 
  
  openExportModal() {
    const data = this.vendors.map(vendor => ({
      'Vendor ID': vendor.vendorID,
      'Vendor Name':vendor.vendorName,
      'Vendor Address':vendor.vendorAddress,
      'Tier':vendor.tier?.tierName,
      'Category':vendor.category?.categoryName,
      'Contact Name':vendor.user?.name,
      'Contact Email':vendor.user?.email ,
      'Contact Number':vendor.user?.contact_Number,
    }));
    
    this.modalService.setDataAndColumns(data, this.selectedColumns);
    this.modalService.showExportModal();
  }

}