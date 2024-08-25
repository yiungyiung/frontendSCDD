import { Component, OnInit } from '@angular/core';
import { Question} from '../../model/question';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { questionnaire } from '../../model/questionnaire';
import { Domain } from '../../model/entity';
import { EntityService } from '../../services/EntityService/Entity.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { AuthService } from '../../services/AuthService/auth.service';
@Component({
  selector: 'app-QuestionnaireAnswering',
  templateUrl: './QuestionnaireAnswering.component.html',
  styleUrls: ['./QuestionnaireAnswering.component.css']
})
export class QuestionnaireAnsweringComponent implements OnInit {
  selectedQuestionnaire: questionnaire | undefined;
  selectedQuestion: Question | undefined;
  domains: Domain[] = [];
  filteredDomains: Domain[] = []; // New property to store filtered domains
  questionsByDomain: { [key: number]: Question[] } = {};
  selectedDomainID: number | null = null; // Track selected domain

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private entityService: EntityService,
    private questionnaireService: QuestionnaireService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.route.paramMap.subscribe(params => {
      const questionnaireID = Number(params.get('questionnaireID'));
      if (questionnaireID) {
        this.loadQuestionnaire(questionnaireID, token);
        this.loadDomains(token);
      }
    });
  }

  loadQuestionnaire(questionnaireID: number, token: string): void {
    this.questionnaireService.getQuestionsByQuestionnaireId(questionnaireID, token).subscribe(questionnaire => {
      this.selectedQuestionnaire = questionnaire;
      this.loadQuestions(token);
    });
  }

  loadDomains(token: string): void {
    this.entityService.GetAllDomains(token).subscribe(domains => {
      this.domains = domains;
    });
  }

  loadQuestions(token: string): void {
    if (this.selectedQuestionnaire) {
      this.selectedQuestionnaire.questionIDs.forEach(questionID => {
        this.questionService.getQuestionById(questionID, token).subscribe(question => {
          if (!this.questionsByDomain[question.domainID]) {
            this.questionsByDomain[question.domainID] = [];
          }
          this.questionsByDomain[question.domainID].push(question);
        });
      });

      // Filter domains based on questions
      this.filteredDomains = this.domains.filter(domain =>
        this.selectedQuestionnaire?.questionIDs.some(questionID => {
          const question = this.questionsByDomain[domain.domainID]?.find(q => q.questionID === questionID);
          return !!question;
        })
      );
    }
  }

  getQuestionsByDomain(domainID: number): Question[] {
    return this.questionsByDomain[domainID] || [];
  }

  onQuestionClick(question: Question): void {
    this.selectedQuestion = question;
  }

  onDomainSelect(domainID: number): void {
    this.selectedDomainID = domainID;
  }
}
