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
  styleUrls: ['./DynamicReports.component.scss'],
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

    this.reportStateService.selectedQuestions$.subscribe(() => {
      this.updateDisplay();
    });

    this.reportStateService.selectedVendorAssignments$.subscribe(() => {
      this.updateDisplay();
    });

    this.reportStateService.selectedQuestionnaire$.subscribe(() => {
      this.responses = [];
      this.selectedQuestion = [];
    });
    this.reportStateService.selectedQuestionnaire$.subscribe(() => {
      this.clearData();
    });
  }
  clearData() {
    this.responses = [];
    this.selectedQuestion = [];
    this.pagedResponses = [];
    this.currentPage = 1;
    this.totalItems = 0;
    this.totalPages = 0;
  }
  updateDisplay() {
    this.clearData();
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

    this.responseService
      .getAllResponsesForQuestionnaire(questionnaireId)
      .subscribe((responses: QuestionnaireAssignmentResponseDto[]) => {
        this.responses = responses.map((response) => {
          // Filter questions that match the selected question IDs
          response.questions = response.questions.filter((q) =>
            questionIds.includes(q.questionID)
          );
          return response;
        });

        // Ensure that selectedQuestion aligns with the filtered responses
        this.selectedQuestion = [];
        for (let response of this.responses) {
          for (let question of response.questions) {
            this.loadQuestionById(question.questionID);
          }
        }
        this.updatePagination();
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

          this.responses.push({ ...response, vendorName });
          responsesCount++;

          if (responsesCount === totalResponses) {
            this.selectedQuestion = [];
            for (let response of this.responses) {
              for (let question of response.questions) {
                this.loadQuestionById(question.questionID);
              }
            }
            this.updatePagination();
          }
        });
    }
  }

  loadQuestionById(id: number) {
    const token = this.authService.getToken();
    const existingIndex = this.selectedQuestion.findIndex(
      (q) => q.questionID === id
    );

    if (existingIndex !== -1) {
      this.selectedQuestion.splice(existingIndex, 1);
    }

    this.questionService.getQuestionById(id, token).subscribe(
      (question) => {
        this.selectedQuestion.push(question);
        this.selectedQuestion.sort((a, b) => {
          if (a.questionID === undefined) return 1; 
          if (b.questionID === undefined) return -1; 
          return a.questionID - b.questionID;
        });

        console.log('Question added:', question);
        console.log('Updated selectedQuestion:', this.selectedQuestion);
      },
      (error) => {
        console.error('Error loading question:', error);
      }
    );
  }

  updatePagination() {
    this.totalItems = this.responses.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePagedResponses();
  }

  // In your pagination or data update logic
onPageChange(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePagedResponses();
  }
}

onItemsPerPageChange(itemsPerPage: number) {
  this.itemsPerPage = itemsPerPage;
  this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  this.currentPage = 1;
  this.updatePagedResponses();
}
updatePagedResponses() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  
  this.pagedResponses = this.responses.slice(startIndex, endIndex);

  // Send only the paginated data to other components
  this.sendPaginatedData();
}
sendPaginatedData() {
  const paginatedData = this.pagedResponses.map((response) => {
    const filteredQuestions = response.questions.filter((q) =>
      this.selectedQuestion.some((sq) => sq.questionID === q.questionID)
    );
    return { ...response, questions: filteredQuestions };
  });

  // Send paginatedData to other components or files
  // Example: this.someService.sendData(paginatedData);
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
