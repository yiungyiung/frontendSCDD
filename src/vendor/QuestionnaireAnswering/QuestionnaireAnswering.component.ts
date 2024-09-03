import { Component, OnInit } from '@angular/core';
import { Question } from '../../model/question';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { questionnaire } from '../../model/questionnaire';
import { Domain } from '../../model/entity';
import { EntityService } from '../../services/EntityService/Entity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { ResponseDto, TextBoxResponseDto } from '../../model/ResponseDto';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { PopupService } from '../../services/PopupService/popup.service';

@Component({
  selector: 'app-QuestionnaireAnswering',
  templateUrl: './QuestionnaireAnswering.component.html',
  styleUrls: ['./QuestionnaireAnswering.component.css'],
})
export class QuestionnaireAnsweringComponent implements OnInit {
  selectedQuestionnaire: questionnaire | undefined;
  selectedQuestion!: Question;
  domains: Domain[] = [];
  filteredDomains: Domain[] = [];
  questionsByDomain: { [key: number]: Question[] } = {};
  toggledSubParts: { [key: string]: boolean } = {};
  selectedDomainID: number | null = null;

  // Store responses temporarily
  responses: { [questionID: number]: ResponseDto } = {};
  answeredQuestions = new Set<number>(); // Track answered question IDs
  selectedOption: number | null = null;
  textboxResponses: { [key: number]: string } = {};
  assignmentID: number | null = null;
  questionnaireID: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private entityService: EntityService,
    private questionnaireService: QuestionnaireService,
    private authService: AuthService,
    private responseService: ResponseService,
    private router: Router,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.assignmentID = state.assignmentID;
    this.questionnaireID = state.questionnaireID;
    const token = this.authService.getToken();
    if (this.questionnaireID) {
      console.log('Received assignmentID:', this.assignmentID);
      console.log('Received questionnaireID:', this.questionnaireID);
      if (this.questionnaireID) {
        this.loadQuestionnaire(this.questionnaireID, token);
        this.loadDomains(token);
      }
    }
  }

  toggleSubPart(categoryID: number): void {
    this.toggledSubParts[categoryID] = !this.toggledSubParts[categoryID];
  }

  isSubPartToggled(categoryID: number): boolean {
    return !!this.toggledSubParts[categoryID];
  }

  loadQuestionnaire(questionnaireID: number, token: string): void {
    this.questionnaireService
      .getQuestionsByQuestionnaireId(questionnaireID, token)
      .subscribe((questionnaire) => {
        this.selectedQuestionnaire = questionnaire;
        this.loadQuestions(token);
      });
  }

  loadDomains(token: string): void {
    this.entityService.GetAllDomains(token).subscribe((domains) => {
      this.domains = domains;
    });
  }

  loadQuestions(token: string): void {
    if (this.selectedQuestionnaire) {
      this.selectedQuestionnaire.questionIDs.forEach((questionID) => {
        this.questionService
          .getQuestionById(questionID, token)
          .subscribe((question) => {
            if (!this.questionsByDomain[question.domainID]) {
              this.questionsByDomain[question.domainID] = [];
            }
            this.questionsByDomain[question.domainID].push(question);
            this.updateFilteredDomains();
          });
      });
    }
  }

  updateFilteredDomains(): void {
    this.filteredDomains = this.domains.filter(
      (domain) =>
        this.questionsByDomain[domain.domainID] &&
        this.questionsByDomain[domain.domainID].length > 0
    );
  }

  getQuestionsByDomain(domainID: number): Question[] {
    return this.questionsByDomain[domainID] || [];
  }

  onQuestionClick(question: Question): void {
    this.selectedQuestion = question;

    // Retrieve stored response data for this question, if available
    const storedResponse = this.responses[question.questionID!];
    if (storedResponse) {
      this.selectedOption = storedResponse.optionID ?? null;
      this.textboxResponses = {};
      storedResponse.textBoxResponses!.forEach((tb) => {
        this.textboxResponses[tb.textBoxID] = tb.textValue;
      });
    } else {
      this.selectedOption = null;
      this.textboxResponses = {};
    }
  }

  saveCurrentResponse(): void {
    if (!this.selectedQuestion) return;

    const response: ResponseDto = {
      assignmentID: this.assignmentID!, // Replace with actual assignment ID
      questionID: this.selectedQuestion.questionID!,
      optionID: this.selectedOption ?? undefined,
      textBoxResponses: this.getTextBoxResponses(),
    };

    // Save response to local storage
    this.responses[this.selectedQuestion.questionID!] = response;
    this.answeredQuestions.add(this.selectedQuestion.questionID!); // Mark question as answered
  }

  resetCurrentResponse(): void {
    if (!this.selectedQuestion) return;

    // Reset local state
    this.selectedOption = null;
    this.textboxResponses = {};

    // Remove the stored response for the current question
    delete this.responses[this.selectedQuestion.questionID!];
    this.answeredQuestions.delete(this.selectedQuestion.questionID!); // Mark question as unanswered
  }

  onSubmitAllResponses(): void {
    const allResponses = Object.values(this.responses);

    if (
      allResponses.length !== this.selectedQuestionnaire?.questionIDs.length
    ) {
      console.warn('Not all questions have been answered.');
      return;
    }

    this.responseService.submitAllResponses(allResponses).subscribe(
      (result) => {
        this.popupService.showPopup(
          'All responses submitted successfully',
          '#339a2d'
        );
        console.log('All responses submitted successfully', result);
        this.router.navigate(['/vendor/dashboard']);
      },
      (error) => {
        this.popupService.showPopup(
          'Error submitting all responses',
          '#dc3545'
        );
        console.error('Error submitting all responses', error);
      }
    );
  }

  getTextBoxResponses(): TextBoxResponseDto[] {
    const textBoxResponses: TextBoxResponseDto[] = [];
    for (const textBoxID in this.textboxResponses) {
      if (this.textboxResponses.hasOwnProperty(textBoxID)) {
        textBoxResponses.push({
          textBoxID: Number(textBoxID),
          textValue: this.textboxResponses[textBoxID],
        });
      }
    }
    return textBoxResponses;
  }

  isQuestionAnswered(questionID: number): boolean {
    return this.answeredQuestions.has(questionID);
  }
}
