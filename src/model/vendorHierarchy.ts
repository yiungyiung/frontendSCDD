export interface VendorHierarchy {
  vendorID: number;
  vendorName: string;
  tierID: number;
  children: VendorHierarchy[];
}
