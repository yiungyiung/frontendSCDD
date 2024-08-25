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
  styleUrls: ['./SelectQuestions.component.css'],
})
export class SelectQuestionsComponent implements OnInit {
  frameworkID!: number;
  vendorCategories: number[] = [];
  vendorName: string[] = [];
  frameworkName!: string;
  sortedQuestionsByDomain: { [domainID: number]: Question[] } = {};
  selectedQuestions: number[] = [];
  domainIDs: number[] = [];
  domainMap: { [id: number]: Domain } = {};
  categoryMap: { [id: number]: string } = {};
  isLoading: boolean = true;
  toggledSubParts: { [key: string]: boolean } = {};

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
    this.vendorName = state.vendorName;
    this.frameworkName = state.frameworkName;
    console.log(this.frameworkName);

    if (this.frameworkID && this.vendorCategories.length > 0) {
      this.loadDomains();
      this.loadCategories();
      this.loadQuestions();
    }
  }

  toggleSubPart(domainID: number): void {
    this.toggledSubParts[domainID] = !this.toggledSubParts[domainID];
  }

  isSubPartToggled(domainID: number): boolean {
    return !!this.toggledSubParts[domainID];
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
    this.entityService.GetAllDomains(token).subscribe((domains) => {
      domains.forEach((domain) => {
        this.domainMap[domain.domainID] = domain;
      });
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  loadCategories(): void {
    const token = this.authService.getToken();
    this.entityService.GetAllCategory(token).subscribe((categories) => {
      categories.forEach((category) => {
        this.categoryMap[category.categoryID] = category.categoryName; // Map categoryID to categoryName
      });
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  loadQuestions(): void {
    const token = this.authService.getToken();
    this.questionService
      .getQuestionIdsByFramework(this.frameworkID, token)
      .subscribe((questionIDs) => {
        const questionLoadPromises = questionIDs.map((id) => {
          return new Promise<void>((resolve) => {
            this.questionService
              .getQuestionById(id, token)
              .subscribe((question) => {
                if (
                  question.questionID !== undefined &&
                  this.vendorCategories.includes(question.categoryID)
                ) {
                  if (!this.sortedQuestionsByDomain[question.domainID]) {
                    this.sortedQuestionsByDomain[question.domainID] = [];
                  }
                  this.sortedQuestionsByDomain[question.domainID].push(
                    question
                  );
                }
                resolve();
              });
          });
        });

        Promise.all(questionLoadPromises).then(() => {
          // Set domain IDs after all questions are loaded
          this.domainIDs = Object.keys(this.sortedQuestionsByDomain).map(
            (id) => +id
          );
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

  onQuestionSelectionChange(
    questionID: number | undefined,
    event: Event
  ): void {
    if (questionID !== undefined) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.checked) {
        if (!this.selectedQuestions.includes(questionID)) {
          this.selectedQuestions.push(questionID);
        }
      } else {
        this.selectedQuestions = this.selectedQuestions.filter(
          (id) => id !== questionID
        );
      }
      console.log(this.selectedQuestions);
    }
  }

  onSubmit(): void {
    console.log('Selected Questions:', this.selectedQuestions);

    // Further logic to handle selected questions...
  }
}
