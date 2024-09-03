import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-DynamicReports',
  templateUrl: './DynamicReports.component.html',
  styleUrls: ['./DynamicReports.component.css'],
})
export class DynamicReportsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  isQuestionnaireVisible = true;
  isVendorsVisible = true;
  isResponseVisible = true;

  collapseColumn(column: string) {
    switch (column) {
      case 'questionnaire':
        this.isQuestionnaireVisible = false;
        break;
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
      case 'questionnaire':
        this.isQuestionnaireVisible = true;
        break;
      case 'vendors':
        this.isVendorsVisible = true;
        break;
      case 'response':
        this.isResponseVisible = true;
        break;
    }
  }
}
