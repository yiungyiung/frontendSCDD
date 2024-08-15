import { Component, OnInit } from '@angular/core';

enum QuestionType {
  SELECT_ONE = 'SELECT_ONE',
  SELECT_MULTIPLE = 'SELECT_MULTIPLE',
  TEXT_BOX = 'TEXT_BOX',
  ATTACH_FILE = 'ATTACH_FILE',
  DATE = 'DATE'
}

@Component({
  selector: 'app-AddQuestion',
  templateUrl: './AddQuestion.component.html',
  styleUrls: ['./AddQuestion.component.css']
})
export class AddQuestionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  questionTypes = QuestionType; // Enum for referencing in the template
  selectedComponents: { type: QuestionType, id: number }[] = []; // To track added components
  private componentId = 0; // Unique ID for each added component

//  addComponent(type: QuestionType) {
  //  this.selectedComponents.push({ type, id: this.componentId++ });
  //}
  // In your parent component (e.g., QuestionTypeContainerComponent)

addComponent(type: QuestionType) {
  switch (type) {
      case this.questionTypes.SELECT_ONE:
          this.selectedComponents.push({ type, id: this.componentId++});
          break;
      case this.questionTypes.SELECT_MULTIPLE:
          this.selectedComponents.push({  type, id: this.componentId++});
          break;
      case this.questionTypes.TEXT_BOX:
          this.selectedComponents.push({ type, id: this.componentId++});
          break;
      case this.questionTypes.ATTACH_FILE:
          this.selectedComponents.push({ type, id: this.componentId++ });
          break;
      case this.questionTypes.DATE:
          this.selectedComponents.push({ type, id: this.componentId++ });
          break;
      default:
          break;
  }
}

  removeComponent(id: number) {
    this.selectedComponents = this.selectedComponents.filter(component => component.id !== id);
  }
  
}
