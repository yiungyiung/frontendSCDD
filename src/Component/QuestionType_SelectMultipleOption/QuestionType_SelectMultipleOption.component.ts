import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-QuestionType_SelectMultipleOption',
  templateUrl: './QuestionType_SelectMultipleOption.component.html',
  styleUrls: ['./QuestionType_SelectMultipleOption.component.css']
})
export class QuestionType_SelectMultipleOptionComponent implements OnInit {
  @Output() remove = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  options: string[] = ['Option 1']; // Initial option

  addOption() {
    this.options.push(`Option ${this.options.length + 1}`);
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  removeComponent() {
    this.remove.emit();
  }

}
