import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Domain, Framework } from '../../model/entity';
import { Question, Textbox, FileUpload, Option } from '../../model/question';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { PopupService } from '../../services/PopupService/popup.service';
import { Router } from '@angular/router';
import { Category } from '../../model/category';

enum QuestionType {
  SELECT_ONE = 'SELECT_ONE',
  TEXT_BOX = 'TEXT_BOX',
  ATTACH_FILE = 'ATTACH_FILE',
  DATE = 'DATE',
}

@Component({
  selector: 'app-AddQuestion',
  templateUrl: './AddQuestion.component.html',
  styleUrls: ['./AddQuestion.component.scss'],
})
export class AddQuestionComponent implements OnInit {
  Framework: Framework[] = [];
  Domain: Domain[] = [];
  Category: Category[] = [];
  isOpen = false;
  selectedTextFramework = 'Select Framework';
  selectedTextDomain = 'Select Domain';
  selectedFramework: string[] = [];
  selectedFrameworks: number[] = [];
  questionText: string = '';
  helperText: string = '';
  selectedDomainID: number | null = null;
  selectedCategoryID: number | null = null;
  questionTypes = QuestionType;
  showFileUpload: boolean = false;
  selectedComponents: {
    type: QuestionType;
    id: number;
    options?: Option[];
    textboxes?: Textbox[];
    fileUploads?: FileUpload[];
  }[] = [];
  private componentId = 0;

  constructor(
    private popupService: PopupService,
    private questionService: QuestionService,
    private entityService: EntityService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFrameworks();
    this.loadDomain();
    this.loadCategory();
  }
  csvHeaders: string[] = [
    'QuestionText',
    'Description',
    'Frameworks',
    'Domain',
    'Category',
    'Options',
    'Textboxes Label',
  ];

  onFileParsed(parsedData: any[]): void {
    this.showFileUpload = false;
    const token = this.authService.getToken();
    let successCount = 0;
    let failureCount = 0;

    const processPromises = parsedData.map((questionData) => {
      return this.processQuestionnaireData(questionData, token)
        .then(() => {
          successCount++;
        })
        .catch(() => {
          failureCount++;
        });
    });

    Promise.all(processPromises).then(() => {
      this.showSummaryPopup(successCount, failureCount);
    });
  }

  private async processQuestionnaireData(
    questionData: any,
    token: string
  ): Promise<void> {
    try {
      const selectedDomain = this.Domain.find(
        (domain) => domain.domainName === questionData.Domain
      );
      const domainID = selectedDomain ? selectedDomain.domainID : null;
      if (!domainID) {
        throw new Error(
          `Domain not found for domain name: ${questionData.Domain}`
        );
      }
      const selectedCategory = this.Category.find(
        (category) => category.categoryName === questionData.Category
      );
      const categoryID = selectedCategory ? selectedCategory.categoryID : null;
      if (!categoryID) {
        throw new Error(
          `Category not found for category name: ${questionData.CategoryName}`
        );
      }

      const frameworkIDs = questionData.Frameworks
        ? questionData.Frameworks.split(',').map((frameworkName: string) => {
            const selectedFramework = this.Framework.find(
              (framework) => framework.frameworkName === frameworkName.trim()
            );
            if (!selectedFramework) {
              throw new Error(
                `Framework not found for framework name: ${frameworkName}`
              );
            }
            return selectedFramework.frameworkID;
          })
        : [];

      const newQuestion: Question = {
        questionText: questionData.QuestionText,
        description: questionData.Description,
        orderIndex: 1,
        domainID: domainID,
        categoryID: categoryID,

        options: questionData.Options.split(',').map(
          (optionText: string, index: number) => ({
            optionText: optionText.trim(),
            orderIndex: index + 1,
          })
        ),

        textboxes: questionData['Textboxes Label']
          .split(',')
          .map((label: string, index: number) => ({
            label: label.trim(),
            orderIndex: index + 1,
            uomid: 1,
          })),
        /*
        fileUploads: questionData.FileUploads
          ? questionData.FileUploads.split(',').map((file: string) =>
              file.trim()
            )
          : [],
*/
        fileUploads: [],
        frameworkIDs: frameworkIDs,
      };
      console.log('Questionnn:', newQuestion);

      this.questionService.addQuestion(newQuestion, token).subscribe(
        (response) => {
          console.log('Response:', response);
          this.popupService.showPopup(
            'New Question added sucessfully',
            '#339a2d'
          );
          this.router.navigate(['/admin/dashboard']);
        },
        (error) => {
          console.error('Error:', error);
          this.popupService.showPopup(
            'There was an error while adding new question. Please try again',
            '#dc3545'
          );
        }
      );
    } catch (error) {
      console.error('Error adding question from file:', error);
      throw error;
    }
  }

  private showSummaryPopup(successCount: number, failureCount: number): void {
    const message = `${successCount} users added successfully, ${failureCount} could not be added.`;
    this.popupService.showPopup(message, '#0F9D09');
  }
  onCancelFileUpload(): void {
    this.showFileUpload = false;
  }

  loadCategory() {
    const token = this.authService.getToken();
    this.entityService.GetAllCategory(token).subscribe(
      (Category) => {
        this.Category = Category;
        console.log('Loaded Category:', this.Category);
      },
      (error) => console.error('Error loading Category:', error)
    );
  }

  loadDomain() {
    const token = this.authService.getToken();
    this.entityService.GetAllDomains(token).subscribe(
      (Domains) => {
        this.Domain = Domains;
        console.log('Loaded Domains:', this.Domain);
      },
      (error) => console.error('Error loading Domains:', error)
    );
  }

  loadFrameworks() {
    const token = this.authService.getToken();
    this.entityService.GetAllFrameworks(token).subscribe(
      (Frameworks) => {
        this.Framework = Frameworks;
      },
      (error) => {
        console.error('Error loading Frameworks:', error);
      }
    );
  }

  addComponent(type: QuestionType) {
    this.selectedComponents.push({ type, id: this.componentId++ });
  }

  removeComponent(id: number) {
    this.selectedComponents = this.selectedComponents.filter(
      (component) => component.id !== id
    );
  }

  toggleFileUpload(): void {
    this.showFileUpload = !this.showFileUpload;
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
      orderIndex: 1,
      domainID: this.selectedDomainID ? this.selectedDomainID : 0,
      categoryID: this.selectedCategoryID ? this.selectedCategoryID : 0,
      options: this.collectOptions(),
      textboxes: this.collectTextboxes(),
      fileUploads: this.collectFileUploads(),
      frameworkIDs: this.selectedFrameworks,
    };
    const token: string = this.authService.getToken();

    this.questionService.addQuestion(newQuestion, token).subscribe(
      (response) => {
        console.log('Response:', response);
        this.popupService.showPopup(
          'New Question added sucessfully',
          '#339a2d'
        );
        this.router.navigate(['/admin/dashboard']);
      },
      (error) => {
        console.error('Error:', error);
        this.popupService.showPopup(
          'There was an error while adding new question. Please try again',
          '#dc3545'
        );
      }
    );
  }

  handleOptionsChange(
    data: { subQuestion: string; options: string[] },
    componentId: number
  ) {
    const component = this.selectedComponents.find(
      (comp) => comp.id === componentId
    );
    if (component) {
      component.options = data.options.map((option, index) => ({
        optionText: option,
        orderIndex: index,
      }));
    }
  }

  handleTextboxChange(
    data: { textbox: string; uomID: number },
    componentId: number
  ) {
    const component = this.selectedComponents.find(
      (comp) => comp.id === componentId
    );
    if (component) {
      component.textboxes = [
        {
          label: data.textbox,
          uomid: data.uomID,
          orderIndex: 0,
        },
      ];
    }
  }

  handleFileUploadChange(fileUpload: FileUpload, componentId: number) {
    const component = this.selectedComponents.find(
      (comp) => comp.id === componentId
    );
    if (component) {
      component.fileUploads = [
        {
          label: fileUpload.label,
          orderIndex: 0,
        },
      ];
    }
  }

  collectOptions(): Option[] {
    let options: Option[] = [];
    this.selectedComponents.forEach((component) => {
      if (component.type === this.questionTypes.SELECT_ONE) {
        if (component.options) {
          options = options.concat(component.options);
        }
      }
    });
    return options;
  }

  collectTextboxes(): Textbox[] {
    let textboxes: Textbox[] = [];
    this.selectedComponents.forEach((component) => {
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
    this.selectedComponents.forEach((component) => {
      if (component.type === this.questionTypes.ATTACH_FILE) {
        if (component.fileUploads) {
          fileUploads = fileUploads.concat(component.fileUploads);
        }
      }
    });
    return fileUploads;
  }
}
