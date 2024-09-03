import { Component, OnInit, Input } from '@angular/core';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { QuestionnaireAssignmentResponseDto } from '../../model/QuestionOptionResponseDto';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { Question } from '../../model/question';

export interface ExtendedQuestionnaireAssignmentResponseDto
  extends QuestionnaireAssignmentResponseDto {
  vendorName?: string; // Add any new properties here
}

@Component({
  selector: 'app-DynamicDisplay',
  templateUrl: './DynamicDisplay.component.html',
  styleUrls: ['./DynamicDisplay.component.css'],
})
export class DynamicDisplayComponent implements OnInit {
  @Input() responses: ExtendedQuestionnaireAssignmentResponseDto[] = [];
  @Input() selectedQuestion: Question[] = [];

  constructor(
    private responseService: ResponseService,
    private reportStateService: ReportStateService,
    private questionService: QuestionService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
}
