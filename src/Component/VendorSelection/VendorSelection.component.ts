import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vendor } from '../../model/vendor';

@Component({
  selector: 'app-VendorSelection',
  templateUrl: './VendorSelection.component.html',
  styleUrls: ['./VendorSelection.component.scss'],
})
export class VendorSelectionComponent {
  @Input() categorizedVendors: any[] = []; // Input for categorized vendors
  @Input() selectedCategoryID: number | undefined; // Input for the selected category ID
  @Output() vendorSelectionChanged = new EventEmitter<{
    vendorID: number;
    isSelected: boolean;
  }>(); // Output event when vendor selection changes

  collapsedStates: { [key: number]: boolean } = {}; // Track the collapsed state of each category
  selectedVendors: { [vendorID: number]: boolean } = {}; // Track selected vendors

  // Toggle collapse state for a category
  toggleCollapse(index: number) {
    this.collapsedStates[index] = !this.collapsedStates[index];
  }

  // Check if a category is expanded or collapsed
  isCollapseExpanded(index: number): boolean {
    return this.collapsedStates[index] || false;
  }

  // Select or deselect all vendors in a category
  selectAllVendors(category: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    category.vendors.forEach((vendor: Vendor) => {
      if (vendor.vendorID !== undefined) {
        this.selectedVendors[vendor.vendorID] = isChecked;
        this.vendorSelectionChanged.emit({
          vendorID: vendor.vendorID,
          isSelected: isChecked,
        });
      }
    });
  }

  // Handle individual vendor selection change
  onVendorSelectionChange(event: Event, vendor: Vendor) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (vendor.vendorID !== undefined) {
      this.selectedVendors[vendor.vendorID] = isChecked;
      this.vendorSelectionChanged.emit({
        vendorID: vendor.vendorID,
        isSelected: isChecked,
      });
    }
  }

  // Determine if a category should be disabled
  isCategoryDisabled(categoryID: number): boolean {
    return (
      this.selectedCategoryID !== undefined &&
      this.selectedCategoryID !== categoryID
    );
  }

  // Determine if a vendor should be disabled
  isVendorDisabled(categoryID: number): boolean {
    return (
      this.selectedCategoryID !== undefined &&
      this.selectedCategoryID !== categoryID
    );
  }

  // Helper method to check if all vendors in the category are selected
  areAllVendorsSelected(category: any): boolean {
    return category.vendors.every(
      (vendor: Vendor) => this.selectedVendors[vendor.vendorID!] === true
    );
  }
}
