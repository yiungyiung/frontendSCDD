export interface ResponseDto {
    assignmentID: number;
    questionID: number;
    optionID?: number; // Optional because some questions might only have textBoxResponses
    textBoxResponses?: TextBoxResponseDto[];
  }
  
  export interface TextBoxResponseDto {
    textBoxID: number;
    textValue: string;
  }