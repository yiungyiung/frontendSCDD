export interface QuestionOptionResponseDto {
  
    optionID: number;
    optionText: string;
    domainID:number;
  }
  
  export interface QuestionTextBoxResponseDto {
    textBoxID: number;
    label: string;
    textValue: string;
  }
  
  export interface QuestionResponseDto {
    questionID: number;
    domainID:number;
    questionText: string;
    optionResponses: QuestionOptionResponseDto[];
    textBoxResponses: QuestionTextBoxResponseDto[];
  }
  
  export interface QuestionnaireAssignmentResponseDto {
    assignmentID: number;
    questionnaireID: number;
    questions: QuestionResponseDto[];
  }