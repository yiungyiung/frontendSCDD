export interface ResponseDto {
  assignmentID: number;
  questionID: number;
  optionID?: number;
  textBoxResponses?: TextBoxResponseDto[];
  fileUploadResponses?: FileUploadResponseDto[];
}

export interface TextBoxResponseDto {
  textBoxID: number;
  textValue: string;
}

export interface FileUploadResponseDto {
fileUploadID :number;
 fileName: string;
 filePath : string;
}
