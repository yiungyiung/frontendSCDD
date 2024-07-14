import { Component, OnInit } from '@angular/core';
import { Vendor } from '../../model/vendor';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { Category } from '../../model/category';
import { Tier } from '../../model/tier';

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

  constructor(private vendorService: VendorService, private authService: AuthService) {}

  ngOnInit() {
    this.loadVendors();
    this.loadCategories();
    this.loadTiers();
  }

  loadVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe(
      serverVendors => this.vendors = serverVendors,
      error => console.error('Error loading vendors:', error)
    );
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
        vendors => this.tier1Vendors = vendors,
        error => console.error('Error loading tier 1 vendors:', error)
      );
    } else {
      this.tier1Vendors = [];
    }
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
      },
      error => console.error('Error adding vendor:', error)
    );
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
}