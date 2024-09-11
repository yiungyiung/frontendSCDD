import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { Question } from '../../model/question';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-DynamicResponseList',
  templateUrl: './DynamicResponseList.component.html',
  styleUrls: ['./DynamicResponseList.component.scss'],
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
    // Subscribe to selected questionnaire ID
    this.reportStateService.selectedQuestionnaire$.subscribe(
      (questionnaireId) => {
        if (questionnaireId) {
          this.loadQuestions(questionnaireId);
        }
      }
    );

    // Subscribe to selected questions
    this.reportStateService.selectedQuestions$.subscribe((questionIds) => {
      this.selectedQuestions = questionIds;
    });
  }

  loadQuestions(questionnaireId: number) {
    const token = this.authService.getToken();
    this.questionnaireService
      .getQuestionsByQuestionnaireId(questionnaireId, token)
      .subscribe((questionnaire) => {
        this.questions = []; // Reset questions array

        // Loop through each question ID from the questionnaire
        for (const questionId of questionnaire.questionIDs) {
          this.questionService
            .getQuestionById(questionId, token)
            .subscribe((question) => {
              this.questions.push(question);

              // Select all questions by default
              if (!this.selectedQuestions.includes(questionId)) {
                this.selectedQuestions.push(questionId);
              }
            });
        }

        // Update the selected questions in the state after loading all questions
        this.reportStateService.updateSelectedQuestions(this.selectedQuestions);
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
