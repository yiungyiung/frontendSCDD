import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { questionnaire } from '../../model/questionnaire';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-DynamicQuestionnairelist',
  templateUrl: './DynamicQuestionnairelist.component.html',
  styleUrls: ['./DynamicQuestionnairelist.component.scss']
})
export class DynamicQuestionnairelistComponent implements OnInit {
  questionnaires: questionnaire[] = [];
  token: string = '';

  constructor(
    private questionnaireService: QuestionnaireService,
    private reportStateService: ReportStateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.authService.getToken();
    this.loadQuestionnaires();
  }

  loadQuestionnaires() {
    this.questionnaireService.getAllQuestionnaires(this.token).subscribe((data) => {
      this.questionnaires = data;
    });
  }

  onSelectQuestionnaire(questionnaireId: number) {
    this.reportStateService.selectQuestionnaire(questionnaireId);
  }
}
