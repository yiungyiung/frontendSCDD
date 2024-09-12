import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-QuestionType_SelectOneOption',
  templateUrl: './QuestionType_SelectOneOption.component.html',
  styleUrls: ['./QuestionType_SelectOneOption.component.scss'],
})
export class QuestionType_SelectOneOptionComponent implements OnInit {
  @Input() id!: number;
  @Output() remove = new EventEmitter<void>();
  @Output() optionsChange = new EventEmitter<{
    subQuestion: string;
    options: string[];
  }>();

  subQuestion: string = '';
  options: string[] = [];
  newOption: string = '';

  constructor() {}

  ngOnInit() {
    this.emitOptions();
  }

  addOption() {
    if (this.newOption.trim()) {
      this.options.push(this.newOption.trim());
      this.newOption = '';
      this.emitOptions();
    }
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
    this.emitOptions();
  }

  removeComponent() {
    this.remove.emit();
  }

  onSubQuestionChange() {
    this.emitOptions();
  }

  onOptionChange(index: number, value: string) {
    this.options[index] = value;
    this.emitOptions();
  }

  private emitOptions() {
    const dataToEmit = {
      subQuestion: this.subQuestion,
      options: this.options,
    };
    this.optionsChange.emit(dataToEmit);
  }
}
