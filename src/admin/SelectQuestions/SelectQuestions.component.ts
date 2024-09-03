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
  categoryPriority: { [id: number]: number } = {};
  isLoading: boolean = true;
  toggledSubParts: { [key: string]: boolean } = {};
  vendorID: number[] = [];
  questionnaireName: string = '';
  deadline: string = '';
  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private entityService: EntityService,
    private cdr: ChangeDetectorRef,
    private questionnaireService: QuestionnaireService,
    private questionnaireAssignmentService:QuestionnaireAssignmentService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.frameworkID = state.frameworkID;
    this.vendorCategories = state.vendorCategories;
    console.log(this.vendorCategories);
    this.vendorName = state.vendorName;
    this.frameworkName = state.frameworkName;
    this.vendorID=state.vendorID;
    console.log(this.frameworkName);

    if (this.frameworkID && this.vendorCategories.length > 0) {
      this.loadCategories(); 
      this.loadDomains();
      this.loadQuestions();
    }
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
      categories.forEach((category, index) => {
        this.categoryMap[category.categoryID] = category.categoryName;
        // Dynamically assign priority based on order from API or other criteria
        this.categoryPriority[category.categoryID] = index + 1; 
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
                if (question.questionID !== undefined) {
                  if (!this.sortedQuestionsByDomain[question.domainID]) {
                    this.sortedQuestionsByDomain[question.domainID] = [];
                  }
                  this.sortedQuestionsByDomain[question.domainID].push(question);
  
                  // Auto-select questions based on the priority of the first vendor category
                  const firstVendorCategoryID = this.vendorCategories[0];
                  const firstVendorCategoryPriority = this.categoryPriority[firstVendorCategoryID];
                  const questionCategoryPriority = this.categoryPriority[question.categoryID];
  
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
          this.domainIDs = Object.keys(this.sortedQuestionsByDomain).map((id) => +id);
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
    this.cdr.detectChanges(); // Trigger change detection to update UI
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
      year: new Date(this.deadline).getFullYear(), // Extract year from date string
      questionIDs: this.selectedQuestions,
    };

    const token = this.authService.getToken(); // Assume you have a method to get the token

    // Call the createQuestionnaire method from the service
    this.questionnaireService.createQuestionnaire(newQuestionnaire, token)
      .subscribe({
        next: (response) => {
          console.log('Newly created questionnaire:', response.questionnaireID); // Log the response
          const dueDateObj = new Date(this.deadline);
        const dueDateFormatted = dueDateObj.toISOString().split('.')[0]; 
          const newAssignment: QuestionnaireAssignment = {
            vendorIDs: this.vendorID,
            questionnaireID: response.questionnaireID,
            statusID: 2, // Assuming statusID 2 means 'Assigned' or equivalent
            dueDate: dueDateFormatted,
          };

          this.createQuestionnaireAssignment(newAssignment, token);
        },
        error: (error) => {
          console.error('Error creating questionnaire:', error); // Log any errors
        }
      });
  }
  createQuestionnaireAssignment(assignment: QuestionnaireAssignment, token: string): void {
    console.log(assignment);
    this.questionnaireAssignmentService.createQuestionnaireAssignment(assignment, token)
      .subscribe({
        next: (response) => {
          console.log('Questionnaire assignment created successfully:', response);
        },
        error: (error) => {
          console.error('Error creating questionnaire assignment:', error);
        }
      });
  }
}
