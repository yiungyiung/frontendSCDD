import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Domain, Framework } from '../../model/entity';
import { Question, Textbox, FileUpload, Option } from '../../model/question';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';

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
  Framework: Framework[] = [];
  Domain: Domain[] = [];
  isOpen = false;
  selectedTextFramework = 'Select Framework';
  selectedTextDomain = 'Select Domain';
  selectedFramework: string[] = [];
  selectedFrameworks: number[] = [];
  questionText: string = '';
  helperText: string = '';
  selectedDomainID: number | null = null;
  questionTypes = QuestionType; // Enum for referencing in the template
  selectedComponents: { type: QuestionType, id: number, options?: Option[], textboxes?: Textbox[], fileUploads?: FileUpload[] }[] = []; // To track added components
  private componentId = 0; // Unique ID for each added component

  constructor(private entityService: EntityService, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadFrameworks();
    this.loadDomain();
  }

  loadDomain() {
    const token = this.authService.getToken();
    this.entityService.GetAllDomains(token).subscribe(
      (Domains) => {
        this.Domain = Domains;
        console.log('Loaded Domains:', this.Domain);
      },
      error => console.error('Error loading Domains:', error)
    );
  }

  loadFrameworks() {
    const token = this.authService.getToken();
    this.entityService.GetAllFrameworks(token).subscribe(
      (Frameworks) => {
        this.Framework = Frameworks;
      },
      error => {
        console.error('Error loading Frameworks:', error);
      }
    );
  }

  addComponent(type: QuestionType) {
    this.selectedComponents.push({ type, id: this.componentId++ });
  }

  removeComponent(id: number) {
    this.selectedComponents = this.selectedComponents.filter(component => component.id !== id);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onOptionChangeframework(event: Event, framework: Framework) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedFramework.push(framework.frameworkName);
      this.selectedFrameworks.push(framework.frameworkID);
    } else {
      const index = this.selectedFramework.indexOf(framework.frameworkName);
      if (index > -1) {
        this.selectedFramework.splice(index, 1);
        this.selectedFrameworks.splice(index, 1);
      }
    }
    this.updateSelectedTextframework();
  }

  updateSelectedTextframework() {
    if (this.selectedFramework.length === 0) {
      this.selectedTextFramework = 'Select Framework';
    } else if (this.selectedFramework.length === 1) {
      this.selectedTextFramework = this.selectedFramework[0];
    } else {
      this.selectedTextFramework = `${this.selectedFramework.length} frameworks selected`;
    }
  }

  onSubmit() {
    const newQuestion: Question = {
      questionText: this.questionText,
      description: this.helperText,
      orderIndex: 1, // This could be dynamically assigned based on your requirement
      domainID: this.selectedDomainID ? this.selectedDomainID : 0,
      categoryID: 1, // Adjust based on the form input
      options: this.collectOptions(),
      textboxes: this.collectTextboxes(),
      fileUploads: this.collectFileUploads(),
      frameworkIDs: this.selectedFrameworks
    };

    // Handle the submission, e.g., send to the server
    console.log('New Question:', newQuestion);
  }

  handleOptionsChange(data: { subQuestion: string, options: string[] }, componentId: number) {
    const component = this.selectedComponents.find(comp => comp.id === componentId);
    if (component) {
      component.options = data.options.map((option, index) => ({
        optionText: option,
        orderIndex: index // You might need a different approach to set the order index
      }));
    }
  }
  
  
  collectOptions(): Option[] {
    let options: Option[] = [];
    this.selectedComponents.forEach(component => {
      if (component.type === this.questionTypes.SELECT_ONE || component.type === this.questionTypes.SELECT_MULTIPLE) {
        if (component.options) {
          options = options.concat(component.options); // No mapping needed
        }
      }
    });
    return options.slice(1); // Exclude the first option
  }
  
  collectTextboxes(): Textbox[] {
    let textboxes: Textbox[] = [];
    this.selectedComponents.forEach(component => {
      if (component.type === this.questionTypes.TEXT_BOX) {
        if (component.textboxes) {
          textboxes = textboxes.concat(component.textboxes);
        }
      }
    });
    return textboxes;
  }
  
  collectFileUploads(): FileUpload[] {
    let fileUploads: FileUpload[] = [];
    this.selectedComponents.forEach(component => {
      if (component.type === this.questionTypes.ATTACH_FILE) {
        if (component.fileUploads) {
          fileUploads = fileUploads.concat(component.fileUploads);
        }
      }
    });
    return fileUploads;
  }
}
