import { Category } from "./category";
import { Tier } from "./tier";
import { User } from "./user";

export interface Vendor {
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