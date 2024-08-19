import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';

interface Vendor {
  vendorID: number;
  vendorName: string;
  tierID: number;
  children: Vendor[];
}

@Component({
  selector: 'app-vendorHierarchyGraph',
  templateUrl: './vendorHierarchyGraph.component.html',
  styleUrls: ['./vendorHierarchyGraph.component.css'],
})
export class VendorHierarchyGraphComponent implements OnInit, AfterViewInit {
  @ViewChildren('vendorCard', { read: ElementRef })
  vendorCards!: QueryList<ElementRef>;
  @ViewChild('linesContainer', { static: false })
  linesContainer!: ElementRef<SVGSVGElement>;
  @ViewChild('companyButton', { static: false })
  companyButton!: ElementRef<HTMLButtonElement>;
  @Input() vendorHierarchy: Vendor[] = [];
  vendorTiers: Vendor[][] = [];

  constructor() {}
  selectedVendorID: number | null = null;
  tierColors: string[] = [
    '#4e79a7',
    '#f28e2c',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc949',
    '#af7aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ab',
  ];

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
  
    // Check if parentElement exists before proceeding
    if (svg.parentElement) {
      const containerRect = svg.parentElement.getBoundingClientRect();
      svg.setAttribute('width', containerRect.width.toString());
      svg.setAttribute('height', containerRect.height.toString());
    } else {
      console.error('Parent element of the SVG is not available.');
      return;
    }
  
    const vendorCenterMap = new Map<number, { x: number; y: number }>();
    const svgRect = svg.getBoundingClientRect();
  
    // Calculate the center of each vendor card
    this.vendorCards.forEach((card) => {
      const rect = card.nativeElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - svgRect.left;
      const centerY = rect.top + rect.height / 2 - svgRect.top;
      const vendorID = this.vendorTiers.flat().find((vendor) => {
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

  drawAllConnections(vendorCenterMap: Map<number, { x: number; y: number }>) {
    this.drawLinesFromCompanyButton(vendorCenterMap);
    this.drawLinesBetweenNodes(vendorCenterMap);
  }

  hideAllLines() {
    const svg = this.linesContainer.nativeElement;
    const paths = svg.querySelectorAll('.connection-line') as NodeListOf<SVGPathElement>;
    paths.forEach((path: SVGPathElement) => {
      path.style.opacity = '0.1';
      path.style.transition = 'opacity 0.3s ease-in-out';
    });
  }

  onComponentClick(vendorID: number | null) {
    this.selectedVendorID = vendorID;
    this.showRelevantConnections();
    this.disableIrrelevantVendors();
  }
  disableIrrelevantVendors() {
    const allVendors = this.vendorTiers.flat();
    if (this.selectedVendorID === null) {
      // Enable all vendors when no vendor is selected
      allVendors.forEach(vendor => {
        const element = document.querySelector(`button[data-vendor-id="${vendor.vendorID}"]`) as HTMLElement;
        if (element) {
          element.style.opacity = '1';
          element.style.pointerEvents = 'auto';
        }
      });
    } else {
      const selectedVendor = this.findVendorById(this.selectedVendorID);
      if (selectedVendor) {
        const relatedVendors = this.getAllRelatedVendors(selectedVendor);
        
        allVendors.forEach(vendor => {
          const element = document.querySelector(`button[data-vendor-id="${vendor.vendorID}"]`) as HTMLElement;
          if (element) {
            if (relatedVendors.has(vendor.vendorID)) {
              element.style.opacity = '1';
              element.style.pointerEvents = 'auto';
            } else {
              element.style.opacity = '0.3';
              element.style.pointerEvents = 'none';
            }
          }
        });
      }
    }
  }
  getAllRelatedVendors(vendor: Vendor): Set<number> {
    const relatedVendors = new Set<number>();
    
    const addParents = (v: Vendor) => {
      const parent = this.findParentVendor(v);
      if (parent) {
        relatedVendors.add(parent.vendorID);
        addParents(parent);
      }
    };
    
    const addChildren = (v: Vendor) => {
      v.children.forEach(child => {
        relatedVendors.add(child.vendorID);
        addChildren(child);
      });
    };
    
    relatedVendors.add(vendor.vendorID);
    addParents(vendor);
    addChildren(vendor);
    
    return relatedVendors;
  }
  getRelevantVendors(vendor: Vendor, relevantVendors: Set<number>) {
    relevantVendors.add(vendor.vendorID);
    
    // Add parent
    const parent = this.findParentVendor(vendor);
    if (parent) {
      relevantVendors.add(parent.vendorID);
      this.getRelevantVendors(parent, relevantVendors);
    }
    
    // Add children
    vendor.children.forEach(child => {
      relevantVendors.add(child.vendorID);
      this.getRelevantVendors(child, relevantVendors);
    });
  }
  showRelevantConnections() {
    const svg = this.linesContainer.nativeElement;
    const paths = svg.querySelectorAll('.connection-line') as NodeListOf<SVGPathElement>;
  
    if (this.selectedVendorID === null) {
      paths.forEach((path: SVGPathElement) => {
        path.style.opacity = '1';
      });
    } else {
      const selectedVendor = this.findVendorById(this.selectedVendorID);
      if (selectedVendor) {
        const relatedVendors = this.getAllRelatedVendors(selectedVendor);
        paths.forEach((path: SVGPathElement) => {
          const [startID, endID] = path.getAttribute('data-connection')?.split('-') || [];
          if (
            (startID === 'company' && relatedVendors.has(parseInt(endID))) ||
            (relatedVendors.has(parseInt(startID)) && relatedVendors.has(parseInt(endID)))
          ) {
            path.style.opacity = '1';
          } else {
            path.style.opacity = '0.1';
          }
        });
      }
    }
  }
  showConnectionsForVendor(vendor: Vendor, paths: NodeListOf<SVGPathElement>) {
    const parentVendor = this.findParentVendor(vendor);
    paths.forEach((path: SVGPathElement) => {
      const [startID, endID] = path.getAttribute('data-connection')?.split('-') || [];
      if (
        (startID === 'company' && vendor.tierID === 1) ||
        (startID === parentVendor?.vendorID.toString() && endID === vendor.vendorID.toString()) ||
        (startID === vendor.vendorID.toString())
      ) {
        path.style.opacity = '1';
      }
    });
  }

  findVendorById(vendorID: number): Vendor | undefined {
    return this.vendorTiers.flat().find((v) => v.vendorID === vendorID);
  }

  findParentVendor(vendor: Vendor): Vendor | undefined {
    for (const tier of this.vendorTiers) {
      for (const possibleParent of tier) {
        if (
          possibleParent.children.some(
            (child) => child.vendorID === vendor.vendorID
          )
        ) {
          return possibleParent;
        }
      }
    }
    return undefined;
  }

  drawLinesFromCompanyButton(vendorCenterMap: Map<number, { x: number; y: number }>) {
    const svg = this.linesContainer.nativeElement;
    const companyButtonRect = this.companyButton.nativeElement.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const companyCenterX = companyButtonRect.left + companyButtonRect.width / 2 - svgRect.left;
    const companyCenterY = companyButtonRect.top + companyButtonRect.height - svgRect.top;

    const tier1Vendors = this.vendorTiers[0] || [];

    tier1Vendors.forEach((vendor) => {
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
        path.setAttribute('stroke', this.tierColors[0]);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('data-connection', `company-${vendor.vendorID}`);
        path.setAttribute('class', 'connection-line');
        svg.appendChild(path);
      } else {
        console.error('Vendor center not found for:', vendor.vendorName);
      }
    });
  }

  drawLinesBetweenNodes(vendorCenterMap: Map<number, { x: number; y: number }>) {
    const svg = this.linesContainer.nativeElement;

    this.vendorTiers.forEach((tier, index) => {
      if (index > 0) {
        const previousTier = this.vendorTiers[index - 1];
        previousTier.forEach((parent) => {
          parent.children.forEach((child) => {
            const parentCenter = vendorCenterMap.get(parent.vendorID);
            const childCenter = vendorCenterMap.get(child.vendorID);

            if (parentCenter && childCenter) {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              const d = this.createCurvedPath(
                parentCenter.x,
                parentCenter.y + 20,
                childCenter.x,
                childCenter.y - 20
              );
              path.setAttribute('d', d);
              path.setAttribute('fill', 'none');
              path.setAttribute('stroke', this.tierColors[index]);
              path.setAttribute('stroke-width', '2');
              path.setAttribute('data-connection', `${parent.vendorID}-${child.vendorID}`);
              path.setAttribute('class', 'connection-line');
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
