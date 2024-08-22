
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vendor } from '../../model/vendor';
@Component({
  selector: 'app-VendorSelection',
  templateUrl: './VendorSelection.component.html',
  styleUrls: ['./VendorSelection.component.css']
})
export class VendorSelectionComponent {
  @Input() categorizedVendors: any[] = [];
  @Input() selectedCategoryID: number | undefined;
  @Output() vendorSelectionChanged = new EventEmitter<{ vendorID: number, isSelected: boolean }>();

  collapsedStates: { [key: number]: boolean } = {};

  toggleCollapse(index: number) {
    this.collapsedStates[index] = !this.collapsedStates[index];
  }

  isCollapseExpanded(index: number): boolean {
    return this.collapsedStates[index] || false;
  }

  selectAllVendors(category: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    category.vendors.forEach((vendor: Vendor) => {
      if (vendor.vendorID !== undefined) {
        this.vendorSelectionChanged.emit({ vendorID: vendor.vendorID, isSelected: isChecked });
      }
    });
  }

  onVendorSelectionChange(event: Event, vendor: Vendor) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (vendor.vendorID !== undefined) {
      this.vendorSelectionChanged.emit({ vendorID: vendor.vendorID, isSelected: isChecked });
    }
  }

  isCategoryDisabled(categoryID: number): boolean {
    return this.selectedCategoryID !== undefined && this.selectedCategoryID !== categoryID;
  }

  isVendorDisabled(categoryID: number): boolean {
    return this.selectedCategoryID !== undefined && this.selectedCategoryID !== categoryID;
  }
}
