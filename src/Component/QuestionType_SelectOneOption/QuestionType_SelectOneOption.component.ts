import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-QuestionType_SelectOneOption',
  templateUrl: './QuestionType_SelectOneOption.component.html',
  styleUrls: ['./QuestionType_SelectOneOption.component.css']
})
export class QuestionType_SelectOneOptionComponent implements OnInit {
  @Output() remove = new EventEmitter<void>();
  @Output() optionsChanged = new EventEmitter<{subQuestion: string, options: string[]}>();

  subQuestion: string = '';
  options: string[] = []; 
  newOption: string = '';
  isFirstAddition :boolean = true;

  constructor() { }

  ngOnInit() {
  }

  addOption() {
    if (this.isFirstAddition) {
      // Add the first option even if it is empty
      this.options.push(this.newOption);
      this.isFirstAddition = false; // Subsequent additions will require a non-empty value
      this.emitOptions();
    } else {
      // For subsequent additions, ensure the new option is non-empty and unique
      const trimmedOption = this.newOption.trim();
      if (trimmedOption && !this.options.includes(trimmedOption)) {
        this.options.push(trimmedOption);
        this.emitOptions();
      }

  }
}

  removeOption(index: number) {
    this.options.splice(index, 1);
    this.emitOptions();
  }

  removeComponent() {
    this.remove.emit();
  }

  private emitOptions() {
    const dataToEmit = {
      subQuestion: this.subQuestion, // Include the subQuestion in the emitted data
      options: this.options
    };
    this.optionsChanged.emit(dataToEmit);
  }
}

