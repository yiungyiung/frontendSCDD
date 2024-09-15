export interface Tier {
  tierId: number;
  tierName: string;
}

export interface Framework {
  frameworkID: number;
  frameworkName: string;
}
export interface Domain {
  domainID: number;
  domainName: string;
}
export interface FrameworkDetails {
  frameworkID: number;   // Primary key and foreign key to Framework
  details: string;       // Large text for details
  link: string;          // URL for link
  framework: Framework;
}
export interface UnitOfMeasurement {
  uomid: number;
  uomType: string;
}

export interface Status {
  statusID: number;
  statusName: string;
}
