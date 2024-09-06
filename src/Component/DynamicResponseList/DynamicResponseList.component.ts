import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { Question } from '../../model/question';
import { questionnaire } from '../../model/questionnaire';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-DynamicResponseList',
  templateUrl: './DynamicResponseList.component.html',
  styleUrls: ['./DynamicResponseList.component.scss']
})
export class DynamicResponseListComponent implements OnInit {
  questions: Question[] = [];
  selectedQuestions: number[] = [];

  constructor(
    private questionService: QuestionService,
    private questionnaireService: QuestionnaireService,
    private reportStateService: ReportStateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.reportStateService.selectedQuestionnaire$.subscribe((questionnaireId) => {
      if (questionnaireId) {
        this.loadQuestions(questionnaireId);
      }
    });

    this.reportStateService.selectedQuestions$.subscribe((questionIds) => {
      this.selectedQuestions = questionIds;
    });
  }

  loadQuestions(questionnaireId: number) {
    const token = this.authService.getToken();
    this.questionnaireService.getQuestionsByQuestionnaireId(questionnaireId, token).subscribe((questionnaire) => {
      this.questions = []; // Reset questions array

      for (const questionId of questionnaire.questionIDs) {
        this.questionService.getQuestionById(questionId, token).subscribe((question) => {
          this.questions.push(question);
        });
      }
    });
  }

  onQuestionSelect(questionId: number) {
    const index = this.selectedQuestions.indexOf(questionId);
    if (index === -1) {
      this.selectedQuestions.push(questionId);
    } else {
      this.selectedQuestions.splice(index, 1);
    }
    this.reportStateService.updateSelectedQuestions(this.selectedQuestions);
  }
}
