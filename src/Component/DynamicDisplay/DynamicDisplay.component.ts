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

  constructor() {}

  ngOnInit() {
    // Ensure that all questions have the textboxes property
    this.selectedQuestion = this.selectedQuestion.map((question) => ({
      ...question,
      textboxes: question.textboxes || [],
    }));
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
}
