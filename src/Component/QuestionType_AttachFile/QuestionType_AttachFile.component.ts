import { Component, OnInit , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-QuestionType_AttachFile',
  templateUrl: './QuestionType_AttachFile.component.html',
  styleUrls: ['./QuestionType_AttachFile.component.css']
})
export class QuestionType_AttachFileComponent implements OnInit {
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

  isToggled = false;

  onToggleChange(event: any) {
    console.log('Toggle state:', event.checked);
    // Perform any additional logic here
  }

}
