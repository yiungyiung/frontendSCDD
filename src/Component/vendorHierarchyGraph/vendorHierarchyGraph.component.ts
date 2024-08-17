import { Component, OnInit, Input, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';

interface Vendor {
  vendorID: number;
  vendorName: string;
  tierID: number;
  children: Vendor[];
}

@Component({
  selector: 'app-vendorHierarchyGraph',
  templateUrl: './vendorHierarchyGraph.component.html',
  styleUrls: ['./vendorHierarchyGraph.component.css']
})
export class VendorHierarchyGraphComponent implements OnInit, AfterViewInit {
  @ViewChildren('vendorCard', { read: ElementRef }) vendorCards!: QueryList<ElementRef>;
  @ViewChild('linesContainer', { static: false }) linesContainer!: ElementRef<SVGSVGElement>;
  @ViewChild('companyButton', { static: false }) companyButton!: ElementRef<HTMLButtonElement>;
  @Input() vendorHierarchy: Vendor[] = [];
  vendorTiers: Vendor[][] = [];

  constructor() {}

  ngOnInit() {
    this.vendorTiers = this.flattenVendorHierarchy(this.vendorHierarchy);
  }

  createCurvedPath(x1: number, y1: number, x2: number, y2: number): string {
    const midY = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
  }
  
  flattenVendorHierarchy(vendors: Vendor[]): Vendor[][] {
    const tiers: Vendor[][] = [];
    const visited = new Set<number>();
  
    const traverse = (vendor: Vendor) => {
      if (visited.has(vendor.vendorID)) {
        return;
      }
  
      visited.add(vendor.vendorID);
  
      if (!tiers[vendor.tierID - 1]) {
        tiers[vendor.tierID - 1] = [];
      }
      tiers[vendor.tierID - 1].push(vendor);
      vendor.children.forEach(traverse);
    };
  
    vendors.forEach(traverse);
    return tiers;
  }

  ngAfterViewInit() {
    if (!this.linesContainer || !this.vendorCards || !this.vendorCards.length || !this.companyButton) {
      console.error('Lines container, vendor cards, or company button are not available.');
      return;
    }

    const svg = this.linesContainer.nativeElement;
    svg.innerHTML = ''; // Clear previous lines

    const vendorCenterMap = new Map<number, { x: number, y: number }>();
    const svgRect = svg.getBoundingClientRect();

    // Calculate the center of each vendor card
    this.vendorCards.forEach(card => {
      const rect = card.nativeElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - svgRect.left;
      const centerY = rect.top + rect.height / 2 - svgRect.top;
      const vendorID = this.vendorTiers.flat().find(vendor => {
        const cardName = card.nativeElement.textContent?.trim();
        return vendor.vendorName === cardName;
      })?.vendorID;

      if (vendorID !== undefined) {
        vendorCenterMap.set(vendorID, { x: centerX, y: centerY });
      }
    });

    // Draw lines from the "Company" button to Tier 1 nodes only
    this.drawLinesFromCompanyButton(vendorCenterMap);

    // Draw lines between parent and child nodes, ensuring no duplicates
    this.drawLinesBetweenNodes(vendorCenterMap);
  }

  drawLinesFromCompanyButton(vendorCenterMap: Map<number, { x: number, y: number }>) {
    const svg = this.linesContainer.nativeElement;
    const companyButtonRect = this.companyButton.nativeElement.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const companyCenterX = companyButtonRect.left + companyButtonRect.width / 2 - svgRect.left;
    const companyCenterY = companyButtonRect.top + companyButtonRect.height - svgRect.top;
  
    const tier1Vendors = this.vendorTiers[0] || [];
  
    tier1Vendors.forEach(vendor => {
      const vendorCenter = vendorCenterMap.get(vendor.vendorID);
  
      if (vendorCenter) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = this.createCurvedPath(
          companyCenterX,
          companyCenterY,
          vendorCenter.x,
          vendorCenter.y - companyButtonRect.height / 2
        );
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#12789e');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
      } else {
        console.error('Vendor center not found for:', vendor.vendorName);
      }
    });
  }

  drawLinesBetweenNodes(vendorCenterMap: Map<number, { x: number, y: number }>) {
    const svg = this.linesContainer.nativeElement;
  
    this.vendorTiers.forEach((tier, index) => {
      if (index > 0) {
        const previousTier = this.vendorTiers[index - 1];
        previousTier.forEach(parent => {
          parent.children.forEach(child => {
            const parentCenter = vendorCenterMap.get(parent.vendorID);
            const childCenter = vendorCenterMap.get(child.vendorID);
  
            if (parentCenter && childCenter) {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              const d = this.createCurvedPath(
                parentCenter.x,
                parentCenter.y + 20, // Adjust this value as needed
                childCenter.x,
                childCenter.y - 20  // Adjust this value as needed
              );
              path.setAttribute('d', d);
              path.setAttribute('fill', 'none');
              path.setAttribute('stroke', '#12789e');
              path.setAttribute('stroke-width', '2');
              svg.appendChild(path);
            } else {
              console.error('Parent or child center not found:', parent.vendorName, child.vendorName);
            }
          });
        });
      }
    });
  }

  
}
