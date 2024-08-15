import { Component, OnInit, Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-QuestionType_Date',
  templateUrl: './QuestionType_Date.component.html',
  styleUrls: ['./QuestionType_Date.component.css']
})
export class QuestionType_DateComponent implements OnInit {
  @Output() remove = new EventEmitter<void>();
  selectedDate: Date | null = null;
  
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
