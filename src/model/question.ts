export interface Textbox {
    textBoxID?:number;  
    label: string;
    orderIndex: number;
    uomid: number;
  }

  export interface FileUpload {
    fileUploadID?:number;
    label: string;
    orderIndex: number;
  }

  export interface Option {
    optionID?: number;
    optionText: string;
    orderIndex: number;
  }

  
export interface Question {
    questionID?: number;
    questionText: string;
    description: string;
    orderIndex: number;
    domainID: number;
    categoryID: number;
    parentQuestionID?: number;
    options: Option[];
    textboxes: Textbox[];
    fileUploads: FileUpload[];
    frameworkIDs: number[];
  }