import { Component, OnInit, Input } from '@angular/core';
import { QuestionnaireAssignmentResponseDto } from '../../model/QuestionOptionResponseDto';
import { Question } from '../../model/question';

export interface ExtendedQuestionnaireAssignmentResponseDto
  extends QuestionnaireAssignmentResponseDto {
  vendorName?: string;
}

@Component({
  selector: 'app-DynamicDisplay',
  templateUrl: './DynamicDisplay.component.html',
  styleUrls: ['./DynamicDisplay.component.scss'],
})
export class DynamicDisplayComponent implements OnInit {
  @Input() responses: ExtendedQuestionnaireAssignmentResponseDto[] = [];
  @Input() selectedQuestion: Question[] = [];
  uniqueQuestions: Question[] = [];

  constructor() {}

  ngOnInit() {
    // Ensure that all questions have the textboxes property
    this.selectedQuestion = this.selectedQuestion.map((question) => ({
      ...question,
      textboxes: question.textboxes || [],
    }));

    // Filter out duplicate questions
    this.uniqueQuestions = this.getUniqueQuestions(this.selectedQuestion);
  }

  shouldDisplayQuestion(
    selectedQuestions: any[],
    questionID: number,
    index: number
  ): boolean {
    // Return true if the question at the current index is the first occurrence of the questionID
    return (
      selectedQuestions.findIndex((q) => q.questionID === questionID) === index
    );
  }

  // Function to filter out duplicate questions by questionID
  getUniqueQuestions(questions: Question[]): Question[] {
    const unique: Question[] = [];
    const questionIds = new Set<number>();
    questions.forEach((question) => {
      if (!questionIds.has(question.questionID!)) {
        unique.push(question);
        questionIds.add(question.questionID!);
      }
    });
    console.log('uquququ', this.uniqueQuestions);
    return unique;
  }

  // Optional: trackBy function for performance improvement
  trackByQuestionId(index: number, question: Question): number {
    return question.questionID!;
  }

  getOptionResponse(
    response: ExtendedQuestionnaireAssignmentResponseDto,
    questionId: number
  ): string {
    const question = response.questions.find(
      (q) => q.questionID === questionId
    );
    if (
      question &&
      question.optionResponses &&
      question.optionResponses.length > 0
    ) {
      return question.optionResponses.map((opt) => opt.optionText).join(', ');
    }
    return '-';
  }

  getTextboxResponse(
    response: ExtendedQuestionnaireAssignmentResponseDto,
    questionId: number,
    textboxId: number
  ): string {
    const question = response.questions.find(
      (q) => q.questionID === questionId
    );
    if (question && question.textBoxResponses) {
      const textboxResponse = question.textBoxResponses.find(
        (t) => t.textBoxID === textboxId
      );
      return textboxResponse ? textboxResponse.textValue : '';
    }
    return '-';
  }

  getFileUploadResponse(
    response: ExtendedQuestionnaireAssignmentResponseDto,
    questionId: number,
    FileuploadId: number
  ): string {
    const question = response.questions.find(
      (q) => q.questionID === questionId
    );
    if (question && question.fileUploadResponses) {
      const textboxResponse = question.fileUploadResponses.find(
        (t) => Number(t.fileUploadID) === FileuploadId
      );
      return textboxResponse ? textboxResponse.fileName : '';
    }
    return '-';
  }
}
