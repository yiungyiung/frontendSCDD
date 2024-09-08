import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ProgressBar',
  templateUrl: './ProgressBar.component.html',
  styleUrls: ['./ProgressBar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  @Input() totalQuestions: number = 0;
  @Input() answeredQuestions: number = 0;

  // Calculate the percentage of progress
  get progressPercentage(): number {
    return this.totalQuestions === 0
      ? 0
      : (this.answeredQuestions / this.totalQuestions) * 100;
  }

  constructor() {}

  ngOnInit(): void {}
}
