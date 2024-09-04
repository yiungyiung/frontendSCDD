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
  styleUrls: ['./DynamicDisplay.component.css'],
})
export class DynamicDisplayComponent implements OnInit {
  @Input() responses: ExtendedQuestionnaireAssignmentResponseDto[] = [];
  @Input() selectedQuestion: Question[] = [];

  constructor() {}

  ngOnInit() {}
}
