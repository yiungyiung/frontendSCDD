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
  styleUrls: ['./QuestionnaireAnswering.component.scss'],
})
export class QuestionnaireAnsweringComponent implements OnInit {
  // Variables for storing questionnaire, domains, and responses
  selectedQuestionnaire: questionnaire | undefined;
  selectedQuestion!: Question;
  domains: Domain[] = [];
  filteredDomains: Domain[] = [];
  questionsByDomain: { [key: number]: Question[] } = {};
  toggledSubParts: { [key: string]: boolean } = {};
  selectedDomainID: number | null = null;

  // Responses and state tracking for the questionnaire
  responses: { [questionID: number]: ResponseDto } = {};
  answeredQuestions = new Set<number>();
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

  // Initialize the component and load the questionnaire and domain data
  ngOnInit(): void {
    const state = history.state;
    this.assignmentID = state.assignmentID;
    this.questionnaireID = state.questionnaireID;
    const token = this.authService.getToken();

    // Load questionnaire and domains if questionnaire ID is present
    if (this.questionnaireID) {
      console.log('Received assignmentID:', this.assignmentID);
      console.log('Received questionnaireID:', this.questionnaireID);
      this.loadQuestionnaire(this.questionnaireID, token);
      this.loadDomains(token);
    }
  }

  // Toggle the visibility of sub-parts for a given domain
  toggleSubPart(categoryID: number): void {
    this.toggledSubParts[categoryID] = !this.toggledSubParts[categoryID];
  }

  // Check if a sub-part is toggled
  isSubPartToggled(categoryID: number): boolean {
    return !!this.toggledSubParts[categoryID];
  }

  // Load the questionnaire by ID and retrieve its questions
  loadQuestionnaire(questionnaireID: number, token: string): void {
    this.questionnaireService
      .getQuestionsByQuestionnaireId(questionnaireID, token)
      .subscribe((questionnaire) => {
        this.selectedQuestionnaire = questionnaire;
        this.loadQuestions(token);
      });
  }

  // Load all domains
  loadDomains(token: string): void {
    this.entityService.GetAllDomains(token).subscribe((domains) => {
      this.domains = domains;
    });
  }

  // Load questions for the selected questionnaire
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

  // Filter domains to only show those with available questions
  updateFilteredDomains(): void {
    this.filteredDomains = this.domains.filter(
      (domain) =>
        this.questionsByDomain[domain.domainID] &&
        this.questionsByDomain[domain.domainID].length > 0
    );
  }

  // Get all questions for a specific domain
  getQuestionsByDomain(domainID: number): Question[] {
    return this.questionsByDomain[domainID] || [];
  }

  // Handle a question click and load saved responses if available
  onQuestionClick(question: Question): void {
    this.selectedQuestion = question;
    const storedResponse = this.responses[question.questionID!];

    // Populate selected options and textbox responses if already answered
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

  // Save the current response to the question
  saveCurrentResponse(): void {
    if (!this.selectedQuestion) return;

    const response: ResponseDto = {
      assignmentID: this.assignmentID!,
      questionID: this.selectedQuestion.questionID!,
      optionID: this.selectedOption ?? undefined,
      textBoxResponses: this.getTextBoxResponses(),
    };

    this.responses[this.selectedQuestion.questionID!] = response;
    this.answeredQuestions.add(this.selectedQuestion.questionID!);
    this.moveToNextQuestion();
  }

  // Move to the next unanswered question in the list
  moveToNextQuestion(): void {
    if (!this.selectedQuestionnaire) return;

    const currentIndex = this.selectedQuestionnaire.questionIDs.indexOf(
      this.selectedQuestion.questionID!
    );

    // Loop through the remaining questions to find the next unanswered one
    for (
      let i = currentIndex + 1;
      i < this.selectedQuestionnaire.questionIDs.length;
      i++
    ) {
      const nextQuestionID = this.selectedQuestionnaire.questionIDs[i];
      if (!this.answeredQuestions.has(nextQuestionID)) {
        const nextQuestion = this.questionsByDomain[
          this.selectedQuestion.domainID
        ].find((q) => q.questionID === nextQuestionID);
        if (nextQuestion) {
          this.onQuestionClick(nextQuestion);
        }
        return;
      }
    }
  }

  // Reset the current response and remove it from storage
  resetCurrentResponse(): void {
    if (!this.selectedQuestion) return;

    this.selectedOption = null;
    this.textboxResponses = {};
    delete this.responses[this.selectedQuestion.questionID!];
    this.answeredQuestions.delete(this.selectedQuestion.questionID!);
  }

  // Submit all responses to the backend service
  onSubmitAllResponses(): void {
    const allResponses = Object.values(this.responses);

    // Check if all questions have been answered
    if (
      allResponses.length !== this.selectedQuestionnaire?.questionIDs.length
    ) {
      console.warn('Not all questions have been answered.');
      return;
    }

    // Submit all the responses
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

  // Get responses for all textboxes
  getTextBoxResponses(): TextBoxResponseDto[] {
    const textBoxResponses: TextBoxResponseDto[] = [];

    // Map over textbox responses and prepare the response DTOs
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

  // Check if a specific question has already been answered
  isQuestionAnswered(questionID: number): boolean {
    return this.answeredQuestions.has(questionID);
  }
}
