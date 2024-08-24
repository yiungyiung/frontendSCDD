import { Component, OnInit } from '@angular/core';
import { Question } from '../../model/question';
import { AuthService } from '../../services/AuthService/auth.service';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { Domain } from '../../model/entity'; // Import both Domain and Category interfaces
import { EntityService } from '../../services/EntityService/Entity.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-SelectQuestions',
  templateUrl: './SelectQuestions.component.html',
  styleUrls: ['./SelectQuestions.component.css']
})
export class SelectQuestionsComponent implements OnInit {
  frameworkID!: number;
  vendorCategories: number[] = [];
  vendorName:string[]=[];
  frameworkName!:string;
  sortedQuestionsByDomain: { [domainID: number]: Question[] } = {};
  selectedQuestions: { [questionID: number]: boolean } = {};
  domainIDs: number[] = [];
  domainMap: { [id: number]: Domain } = {};
  categoryMap: { [id: number]: string } = {}; // Updated to map categoryID to category name
  isLoading: boolean = true;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private entityService: EntityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.frameworkID = state.frameworkID;
    this.vendorCategories = state.vendorCategories;
    this.vendorName=state.vendorName;
    this.frameworkName=state.frameworkName;
    console.log(this.frameworkName);

    if (this.frameworkID && this.vendorCategories.length > 0) {
      this.loadDomains();
      this.loadCategories(); // Load categories
      this.loadQuestions();
    }
  }

  getFirstCategoryName(): string {
    if (this.vendorCategories.length > 0) {
      const firstCategoryID = this.vendorCategories[0];
      return this.getCategoryName(firstCategoryID);
    }
    return 'No Categories Available'; // Default message if no categories are available
  }
  
  
  loadDomains(): void {
    const token = this.authService.getToken();
    this.entityService.GetAllDomains(token).subscribe(domains => {
      domains.forEach(domain => {
        this.domainMap[domain.domainID] = domain;
      });
      this.cdr.detectChanges(); // Trigger change detection
    });
  }


  loadCategories(): void {
    const token = this.authService.getToken();
    this.entityService.GetAllCategory(token).subscribe(categories => {
      console.log(categories);
      categories.forEach(category => {
        console.log(category.categoryID);
        this.categoryMap[category.categoryID] = category.categoryName; // Map categoryID to categoryName
      });
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  loadQuestions(): void {
    const token = this.authService.getToken();
    this.questionService.getQuestionIdsByFramework(this.frameworkID, token).subscribe(questionIDs => {
      const questionLoadPromises = questionIDs.map(id => {
        return new Promise<void>((resolve) => {
          this.questionService.getQuestionById(id, token).subscribe(question => {
            if (this.vendorCategories.includes(question.categoryID)) {
              if (!this.sortedQuestionsByDomain[question.domainID]) {
                this.sortedQuestionsByDomain[question.domainID] = [];
              }
              this.sortedQuestionsByDomain[question.domainID].push(question);
            }
            resolve();
          });
        });
      });

      Promise.all(questionLoadPromises).then(() => {
        // Set domain IDs after all questions are loaded
        this.domainIDs = Object.keys(this.sortedQuestionsByDomain).map(id => +id);
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection after data is ready
      });
    });
  }

  getDomainName(domainID: number): string {
    return this.domainMap[domainID]?.domainName || 'Unknown Domain';
  }

  getCategoryName(categoryID: number): string {
    return this.categoryMap[categoryID] || 'Unknown Category';
  }

  onQuestionSelectionChange(questionID: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedQuestions[questionID] = inputElement.checked;
  }

  onSubmit(): void {
    const selectedQuestionIDs = Object.keys(this.selectedQuestions)
      .filter(id => this.selectedQuestions[+id])
      .map(id => +id);

    console.log('Selected Questions:', selectedQuestionIDs);

    // Further logic to handle selected questions...
  }
}
