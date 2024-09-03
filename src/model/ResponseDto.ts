export interface ResponseDto {
  assignmentID: number;
  questionID: number;
  optionID?: number;
  textBoxResponses?: TextBoxResponseDto[];
}

export interface TextBoxResponseDto {
  textBoxID: number;
  textValue: string;
}
