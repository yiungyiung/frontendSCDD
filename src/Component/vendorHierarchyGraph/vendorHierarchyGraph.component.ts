import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendorHierarchyGraph',
  templateUrl: './vendorHierarchyGraph.component.html',
  styleUrls: ['./vendorHierarchyGraph.component.css']
})
export class VendorHierarchyGraphComponent implements OnInit {
  @Input() vendorData: any[] = [];
  vendorTiers: any[] = [];

  ngOnInit() {
    this.buildVendorTiers(this.vendorData, 1);
  }

  buildVendorTiers(vendors: any[], tier: number) {
    if (!this.vendorTiers[tier - 1]) {
      this.vendorTiers[tier - 1] = [];
    }

    vendors.forEach(vendor => {
      if (vendor.tierID === tier) {
        this.vendorTiers[tier - 1].push(vendor);
        if (vendor.children && vendor.children.length > 0) {
          this.buildVendorTiers(vendor.children, tier + 1);
        }
      }
    });
  }

  getVendorX(vendor: any): string {
    const index = this.vendorTiers[vendor.tierID - 1].indexOf(vendor);
    const total = this.vendorTiers[vendor.tierID - 1].length;
    return `${(index + 0.5) / total * 100}%`;
  }

  hasChildren(vendor: any): boolean {
    return vendor.children && vendor.children.length > 0;
  }

  
}

