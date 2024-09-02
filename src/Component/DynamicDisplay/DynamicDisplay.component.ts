import { Component, OnInit } from '@angular/core';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { QuestionnaireAssignmentResponseDto } from '../../model/QuestionOptionResponseDto';

export interface ExtendedQuestionnaireAssignmentResponseDto extends QuestionnaireAssignmentResponseDto {
  vendorName?: string; // Add any new properties here
}

@Component({
  selector: 'app-DynamicDisplay',
  templateUrl: './DynamicDisplay.component.html',
  styleUrls: ['./DynamicDisplay.component.css']
})
export class DynamicDisplayComponent implements OnInit {
  responses:  ExtendedQuestionnaireAssignmentResponseDto[] = [];

  constructor(
    private responseService: ResponseService,
    private reportStateService: ReportStateService
  ) {}

  ngOnInit() {
    this.reportStateService.selectedQuestions$.subscribe((questionIds) => {
      const vendorAssignments = this.reportStateService.selectedVendorAssignmentsValue;
      if (vendorAssignments.length > 0) {
        this.loadResponsesForAssignments(vendorAssignments, questionIds);
      } else {
        this.loadResponses(questionIds);
      }
    });
  }

  loadResponses(questionIds: number[]) {
    const questionnaireId = this.reportStateService.selectedQuestionnaireValue;
    if (!questionnaireId || questionIds.length === 0) return;

    this.responses = []; // Reset responses array
    this.responseService.getAllResponsesForQuestionnaire(questionnaireId).subscribe((responses: QuestionnaireAssignmentResponseDto[]) => {
      this.responses = responses;
    });
  }

  loadResponsesForAssignments(vendorAssignments: { vendorID: number, assignmentID: number, vendorName: string }[], questionIds: number[]) {
    if (vendorAssignments.length === 0 || questionIds.length === 0) return;
  
    this.responses = []; // Reset responses array
  
    for (const { assignmentID, vendorName } of vendorAssignments) {
      this.responseService.getResponsesForAssignment(assignmentID).subscribe((response: QuestionnaireAssignmentResponseDto) => {
        // Filter questions based on selected question IDs
        response.questions = response.questions.filter(q => questionIds.includes(q.questionID));
        
        // Assign vendorName correctly to each response
        this.responses.push({ ...response, vendorName });
      });
    }
  }  
}
