import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { questionnaire } from '../../model/questionnaire';
import { AuthService } from '../../services/AuthService/auth.service';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { ExtendedQuestionnaireAssignmentResponseDto } from '../../Component/DynamicDisplay/DynamicDisplay.component';
import { Question } from '../../model/question';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { QuestionnaireAssignmentResponseDto } from '../../model/QuestionOptionResponseDto';

@Component({
  selector: 'app-DynamicReports',
  templateUrl: './DynamicReports.component.html',
  styleUrls: ['./DynamicReports.component.css'],
})
export class DynamicReportsComponent implements OnInit {
  questionnaires: questionnaire[] = [];
  token: string = '';
  isVendorsVisible = true;
  isResponseVisible = true;
  responses: ExtendedQuestionnaireAssignmentResponseDto[] = [];
  pagedResponses: ExtendedQuestionnaireAssignmentResponseDto[] = [];
  selectedQuestion: Question[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private responseService: ResponseService,
    private reportStateService: ReportStateService,
    private authService: AuthService,
    private questionnaireService: QuestionnaireService,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.token = this.authService.getToken();
    this.loadQuestionnaires();
    this.reportStateService.selectedQuestions$.subscribe((questionIds) => {
      this.updateDisplay();
    });

    this.reportStateService.selectedVendorAssignments$.subscribe(() => {
      this.updateDisplay();
    });

    this.reportStateService.selectedQuestionnaire$.subscribe(() => {
      this.responses = []; // Reset responses array on questionnaire change
    });
  }

  updateDisplay() {
    const questionIds = this.reportStateService.selectedQuestionsValue;
    const vendorAssignments =
      this.reportStateService.selectedVendorAssignmentsValue;

    if (vendorAssignments.length > 0) {
      this.loadResponsesForAssignments(vendorAssignments, questionIds);
    } else {
      this.loadResponses(questionIds);
    }
  }

  loadResponses(questionIds: number[]) {
    const questionnaireId = this.reportStateService.selectedQuestionnaireValue;
    if (!questionnaireId || questionIds.length === 0) return;
    this.responses = [];
    this.responseService
      .getAllResponsesForQuestionnaire(questionnaireId)
      .subscribe((responses: QuestionnaireAssignmentResponseDto[]) => {
        responses.forEach((response) => {
          response.questions = response.questions.filter((q) =>
            questionIds.includes(q.questionID)
          );
          response.questions.forEach((q) =>
            this.loadQuestionById(q.questionID)
          );
          this.totalItems = this.responses.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.currentPage = 1;
          this.responses.push(response);
          this.updatePagedResponses();
        });
      });
  }

  loadResponsesForAssignments(
    vendorAssignments: {
      vendorID: number;
      assignmentID: number;
      vendorName: string;
    }[],
    questionIds: number[]
  ) {
    if (vendorAssignments.length === 0 || questionIds.length === 0) return;
    this.responses = [];
    let responsesCount = 0;
    const totalResponses = vendorAssignments.length;
    for (const { assignmentID, vendorName } of vendorAssignments) {
      this.responseService
        .getResponsesForAssignment(assignmentID)
        .subscribe((response: QuestionnaireAssignmentResponseDto) => {
          response.questions = response.questions.filter((q) =>
            questionIds.includes(q.questionID)
          );
          response.questions.forEach((q) =>
            this.loadQuestionById(q.questionID)
          );
          this.responses.push({ ...response, vendorName });
          responsesCount++;
          console.log('selected', this.responses);
          if (responsesCount === totalResponses) {
            this.totalItems = this.responses.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.currentPage = 1;
            this.updatePagedResponses();
          }
        });
    }
  }

  loadQuestionById(id: number) {
    const token = this.authService.getToken();
    if (!this.selectedQuestion.some((q) => q.questionID === id)) {
      this.questionService.getQuestionById(id, token).subscribe(
        (question) => {
          this.selectedQuestion.push(question);
          console.log('Question added:', question);
          console.log('fucking jerks', this.selectedQuestion);
        },
        (error) => {
          console.error('Error loading question:', error);
        }
      );
    } else {
      console.log('Question already exists in selectedQuestion:', id);
    }
  }

  updatePagedResponses() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedResponses = this.responses.slice(startIndex, endIndex);
    console.log('pagedResponses: ', this.pagedResponses);
    console.log('this.itemsPerPage: ', this.itemsPerPage);
    console.log('this.totalItems: ', this.totalItems);
    console.log('this.totalPages: ', this.totalPages);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedResponses();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedResponses();
  }

  loadQuestionnaires() {
    this.questionnaireService
      .getAllQuestionnaires(this.token)
      .subscribe((data) => {
        this.questionnaires = data;
      });
  }

  onSelectQuestionnaire(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedQuestionnaireID = Number(selectElement.value);

    if (!isNaN(selectedQuestionnaireID)) {
      console.log('worinh');
      this.reportStateService.selectQuestionnaire(selectedQuestionnaireID);
    }
  }

  collapseColumn(column: string) {
    switch (column) {
      case 'vendors':
        this.isVendorsVisible = false;
        break;
      case 'response':
        this.isResponseVisible = false;
        break;
    }
  }

  restoreColumn(column: string) {
    switch (column) {
      case 'vendors':
        this.isVendorsVisible = true;
        break;
      case 'response':
        this.isResponseVisible = true;
        break;
    }
  }
}
