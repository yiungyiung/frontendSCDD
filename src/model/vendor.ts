import { Category } from "./category";
import { Tier } from "./tier";
import { User } from "./user";

export interface Vendor {
    vendorID?: number;
    vendorName: string;
    vendorAddress: string;
    tierID: number;
    userID?: number;
    registrationDate?: Date;
    categoryID: number;
    vendorRegistration: string;
    parentVendorIDs?: number[];
    tier?: Tier;
    category?: Category;
    user: User;
}
