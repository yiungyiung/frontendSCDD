export interface Tier {
    tierId : number,
    tierName: string
}

export interface Framework{
    frameworkID: number,
    frameworkName: string
}
export interface Domain{
    domainID: number,
    domainName: string
}

export interface UnitOfMeasurement {
    uomID: number;    // Corresponds to UOMID in the backend
    uomType: string;  // Corresponds to UOMType in the backend
  }
  
  export interface Status{
    statusID: number; // Corresponds to
    statusName : string; // Corresponds to
  }