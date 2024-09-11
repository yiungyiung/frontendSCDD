import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { questionnaire } from '../../model/questionnaire';
import { Question } from '../../model/question';
import { Domain } from '../../model/entity';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-ExistingQuestionnaireModal',
  templateUrl: './ExistingQuestionnaireModal.component.html',
  styleUrls: ['./ExistingQuestionnaireModal.component.scss'],
})
export class ExistingQuestionnaireModalComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Input() selectedQuestionnaire: questionnaire | null = null;
  @Input() domains: Domain[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();

  questionsByDomain: { [domainID: number]: Question[] } = {};

  constructor(
    private questionService: QuestionService,
    private questionnaireService: QuestionnaireService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.isModalOpen && this.selectedQuestionnaire) {
      this.fetchQuestionsByQuestionnaire(
        this.selectedQuestionnaire.questionnaireID!
      );
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
    this.questionsByDomain = {};
  }

  fetchQuestionsByQuestionnaire(questionnaireId: number) {
    const token = this.authService.getToken();
    this.questionnaireService
      .getQuestionsByQuestionnaireId(questionnaireId, token)
      .subscribe(
        (data: questionnaire) => {
          const questionIds = data.questionIDs;
          this.questionsByDomain = {};
          this.fetchQuestionsByIds(questionIds, token);
        },
        (error) => {
          console.error('Error fetching questionnaire details', error);
        }
      );
  }

  fetchQuestionsByIds(questionIds: number[], token: string) {
    questionIds.forEach((id) => {
      this.questionService.getQuestionById(id, token).subscribe(
        (question: Question) => {
          if (!this.questionsByDomain[question.domainID]) {
            this.questionsByDomain[question.domainID] = [];
          }
          this.questionsByDomain[question.domainID].push(question);
        },
        (error) => {
          console.error(`Error fetching question with ID ${id}`, error);
        }
      );
    });
  }

  getDomainName(domainID: number): string {
    const domain = this.domains.find((d) => d.domainID === domainID);
    return domain ? domain.domainName : 'Unknown Domain';
  }

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  getCategoryName(categoryId: number): string {
    // Implement this based on your category structure
    return 'Category Name'; // Placeholder implementation
  }
}
