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
  

  isOpen = false;
  selectedDomains: string[] = [];
  selectedText = 'Select Domain';

  domains = [
    { value: 'domain1', label: 'Domain 1' },
    { value: 'domain2', label: 'Domain 2' },
    { value: 'domain3', label: 'Domain 3' },
  ];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onOptionChange(event: Event, domain: { value: string, label: string }) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDomains.push(domain.value);
    } else {
      const index = this.selectedDomains.indexOf(domain.value);
      if (index > -1) {
        this.selectedDomains.splice(index, 1);
      }
    }
    this.updateSelectedText();
  }

  updateSelectedText() {
    if (this.selectedDomains.length === 0) {
      this.selectedText = 'Select Domain';
    } else if (this.selectedDomains.length === 1) {
      this.selectedText = this.domains.find(d => d.value === this.selectedDomains[0])?.label || '';
    } else {
      this.selectedText = `${this.selectedDomains.length} domains selected`;
    }
  }
}
