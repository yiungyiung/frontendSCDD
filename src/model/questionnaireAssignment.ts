import { Status } from "./entity";
import { Vendor } from "./vendor";

export interface QuestionnaireAssignment {
    assignmentID?:number;
    vendorIDs?: number[];
    questionnaireID: number;
    statusID?: number;
    vendorID? : number;
    assignmentDate?:Date;
    dueDate?:string;
    submissionDate?: Date;
    vendor?:Vendor;
    status?:Status;
}
  