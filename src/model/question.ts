export interface Textbox {
    label: string;
    orderIndex: number;
    uomid: number;
  }

  export interface FileUpload {
    label: string;
    orderIndex: number;
  }

  export interface Option {
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