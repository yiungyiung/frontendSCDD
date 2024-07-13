import { Category } from "./category";
import { Tier } from "./tier";
import { User } from "./user";

export interface Vendor {
    role(role: any): unknown;
    vendorId: any;
    email: any;
    name: any;
    contact_Number: any;
    isActive: any;
    vendorID: number;
    vendorName: string;
    vendorAddress: string;
    tierId: number;
    userId: number;
    registrationDate: Date;
    categoryId: number;
    tier?: Tier;
    category?: Category;
    user?: User;
  }