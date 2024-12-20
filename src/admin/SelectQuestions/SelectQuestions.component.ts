import { Component, OnInit } from '@angular/core';
import { Question } from '../../model/question';
import { AuthService } from '../../services/AuthService/auth.service';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { Domain } from '../../model/entity'; // Import both Domain and Category interfaces
import { EntityService } from '../../services/EntityService/Entity.service';
import { ChangeDetectorRef } from '@angular/core';
import { questionnaire } from '../../model/questionnaire';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { PopupService } from '../../services/PopupService/popup.service';
import { Router } from '@angular/router';
import { SubPart } from '../../Component/filter/filter.component';
import { FilterService } from '../../services/FilterService/Filter.service';
@Component({
  selector: 'app-SelectQuestions',
  templateUrl: './SelectQuestions.component.html',
  styleUrls: ['./SelectQuestions.component.scss'],
})
export class SelectQuestionsComponent implements OnInit {
  frameworkID!: number;
  vendorCategories: number[] = [];
  vendorName: string[] = [];
  frameworkName!: string;
  sortedQuestionsByDomain: { [domainID: number]: Question[] } = {};
  originalSortedQuestionsByDomain: { [domainID: number]: Question[] } = {};
  selectedQuestions: number[] = [];
  domainIDs: number[] = [];
  domainMap: { [id: number]: Domain } = {};
  categoryMap: { [id: number]: string } = {};
  categoryPriority: { [id: number]: number } = {};
  isLoading: boolean = true;
  toggledSubParts: { [key: string]: boolean } = {};
  vendorID: number[] = [];
  questionnaireName: string = '';
  deadline: string = '';
  isFilterVisible = false;
  questions: Question[] = [];
  questionnaireYear: number | undefined;
  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private entityService: EntityService,
    private cdr: ChangeDetectorRef,
    private questionnaireService: QuestionnaireService,
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private popupService: PopupService,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.frameworkID = state.frameworkID;
    this.vendorCategories = state.vendorCategories;
    console.log(this.vendorCategories);
    this.vendorName = state.vendorName;
    this.frameworkName = state.frameworkName;
    this.vendorID = state.vendorID;
    console.log(this.frameworkName);

    if (this.frameworkID && this.vendorCategories.length > 0) {
      this.loadCategories();
      this.loadDomains();
      this.loadQuestions();
    }
  }

  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['Question ID', 'Question'],
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '',
    },
  ];

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  closeFilter(): void {
    this.isFilterVisible = false;
  }

  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    return !!(searchBySubPart && searchBySubPart.selectedOption);
  }

  onFilterChange(event: any) {
    const filters = this.prepareFilters();

    if (this.isFilterApplied()) {
      // Apply filters
      const filteredQuestionsByDomain: { [domainID: number]: Question[] } = {};

      for (const domainID in this.sortedQuestionsByDomain) {
        if (this.sortedQuestionsByDomain.hasOwnProperty(domainID)) {
          const questions = this.sortedQuestionsByDomain[domainID];
          const filteredQuestions = this.filterService.applyFilter(
            questions,
            filters
          );

          if (filteredQuestions.length > 0) {
            filteredQuestionsByDomain[+domainID] = filteredQuestions;
          }
        }
      }

      // Update the filtered questions by domain
      this.sortedQuestionsByDomain = filteredQuestionsByDomain;
    } else {
      // No filters applied, restore original questions
      this.sortedQuestionsByDomain = {
        ...this.originalSortedQuestionsByDomain,
      };
    }

    // Update the view or trigger change detection if necessary
    this.cdr.detectChanges();
  }

  // Prepare filters based on selected options in filterSubParts
  prepareFilters() {
    const filters: {
      partName: string;
      value: string | string[];
      column: keyof Question | ((item: Question) => any);
      exactMatch?: boolean;
    }[] = [];

    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    const searchKeywordSubPart = this.filterSubParts.find(
      (part) => part.name === 'Search Keyword'
    );

    // Map the selected option to actual Question object keys
    const searchByColumnMap: {
      [key: string]: keyof Question | ((item: Question) => any);
    } = {
      'Question ID': (question) => question.questionID,
      Question: (question) => question.questionText,
    };

    if (
      searchBySubPart &&
      searchKeywordSubPart &&
      searchBySubPart.selectedOption
    ) {
      const column = searchByColumnMap[searchBySubPart.selectedOption];
      if (column) {
        filters.push({
          partName: 'Search By',
          value: searchKeywordSubPart.keyword || '',
          column,
          exactMatch: false,
        });
      }
    }

    return filters;
  }

  toggleSubPart(domainID: number): void {
    this.toggledSubParts[domainID] = !this.toggledSubParts[domainID];
  }

  areAllQuestionsInDomainSelected(domainID: number): boolean {
    const questions = this.sortedQuestionsByDomain[domainID];
    if (!questions || questions.length === 0) return false;
    return questions.every(
      (q) =>
        q.questionID !== undefined &&
        this.selectedQuestions.includes(q.questionID)
    );
  }

  isSubPartToggled(domainID: number): boolean {
    return !!this.toggledSubParts[domainID];
  }

  getFirstCategoryName(): string {
    if (this.vendorCategories.length > 0) {
      const firstCategoryID = this.vendorCategories[0];
      return this.getCategoryName(firstCategoryID);
    }
    return 'No Categories Available';
  }

  loadDomains(): void {
    const token = this.authService.getToken();
    this.entityService.GetAllDomains(token).subscribe((domains) => {
      domains.forEach((domain) => {
        this.domainMap[domain.domainID] = domain;
      });
      this.cdr.detectChanges();
    });
  }

  loadCategories(): void {
    const token = this.authService.getToken();
    this.entityService.GetAllCategory(token).subscribe((categories) => {
      categories.forEach((category, index) => {
        this.categoryMap[category.categoryID] = category.categoryName;
        // Dynamically assign priority based on order from API or other criteria
        this.categoryPriority[category.categoryID] = index + 1;
      });
      this.cdr.detectChanges();
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
                if (question.questionID !== undefined) {
                  if (!this.sortedQuestionsByDomain[question.domainID]) {
                    this.sortedQuestionsByDomain[question.domainID] = [];
                  }
                  this.sortedQuestionsByDomain[question.domainID].push(
                    question
                  );
                  this.questions.push(question);

                  // Save to original data
                  if (
                    !this.originalSortedQuestionsByDomain[question.domainID]
                  ) {
                    this.originalSortedQuestionsByDomain[question.domainID] =
                      [];
                  }
                  this.originalSortedQuestionsByDomain[question.domainID].push(
                    question
                  );

                  // Auto-select questions based on the priority of the first vendor category
                  const firstVendorCategoryID = this.vendorCategories[0];
                  const firstVendorCategoryPriority =
                    this.categoryPriority[firstVendorCategoryID];
                  const questionCategoryPriority =
                    this.categoryPriority[question.categoryID];

                  // Select the question if its priority is less than or equal to the priority of the first vendor category
                  if (questionCategoryPriority >= firstVendorCategoryPriority) {
                    this.selectedQuestions.push(question.questionID);
                  }
                }
                resolve();
              });
          });
        });

        Promise.all(questionLoadPromises).then(() => {
          this.domainIDs = Object.keys(this.sortedQuestionsByDomain).map(
            (id) => +id
          );
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      });
  }

  getDomainName(domainID: number): string {
    return this.domainMap[domainID]?.domainName || 'Unknown Domain';
  }

  getCategoryName(categoryID: number): string {
    return this.categoryMap[categoryID] || 'Unknown Category';
  }

  onDomainSelectionChange(domainID: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const isSelected = inputElement.checked;

    const questions = this.sortedQuestionsByDomain[domainID];
    if (questions) {
      questions.forEach((question) => {
        if (question.questionID !== undefined) {
          if (isSelected) {
            if (!this.selectedQuestions.includes(question.questionID)) {
              this.selectedQuestions.push(question.questionID);
            }
          } else {
            const index = this.selectedQuestions.indexOf(question.questionID);
            if (index !== -1) {
              this.selectedQuestions.splice(index, 1);
            }
          }
        }
      });
    }
    this.cdr.detectChanges();
  }

  onQuestionSelectionChange(questionID: number, event: Event): void {
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

  onSubmit(): void {
    const newQuestionnaire: questionnaire = {
      name: this.questionnaireName,
      year: this.questionnaireYear!,
      questionIDs: this.selectedQuestions,
    };
    const token = this.authService.getToken();
    this.questionnaireService
      .createQuestionnaire(newQuestionnaire, token)
      .subscribe({
        next: (response) => {
          console.log('Newly created questionnaire:', response.questionnaireID);
          const dueDateObj = new Date(this.deadline);
          const dueDateFormatted = dueDateObj.toISOString().split('.')[0];
          const newAssignment: QuestionnaireAssignment = {
            vendorIDs: this.vendorID,
            questionnaireID: response.questionnaireID,
            statusID: 2,
            dueDate: dueDateFormatted,
          };
          this.popupService.showPopup(
            'Questionnaire created Sucessfully',
            '#0F9D09'
          );
          this.createQuestionnaireAssignment(newAssignment, token);
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          console.error('Error creating questionnaire:', error);
          this.popupService.showPopup(
            'Failed to create Questionnaire. Please try again.',
            '#0F9D09'
          );
          this.router.navigate(['/admin/dashboard']);
        },
      });
  }
  createQuestionnaireAssignment(
    assignment: QuestionnaireAssignment,
    token: string
  ): void {
    console.log(assignment);
    this.questionnaireAssignmentService
      .createQuestionnaireAssignment(assignment, token)
      .subscribe({
        next: (response) => {
          console.log(
            'Questionnaire assignment created successfully:',
            response
          );
        },
        error: (error) => {
          console.error('Error creating questionnaire assignment:', error);
        },
      });
  }
}
