import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { QuestionService } from '../../services/QuestionService/Question.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { questionnaire } from '../../model/questionnaire';
import { Question } from '../../model/question';
import { Domain } from '../../model/entity';
import { Vendor } from '../../model/vendor';
import { FilterService } from '../../services/FilterService/Filter.service';
import { SubPart } from '../../Component/filter/filter.component';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';

@Component({
  selector: 'app-AssignQuestionnaire',
  templateUrl: './AssignQuestionnaire.component.html',
  styleUrls: ['./AssignQuestionnaire.component.scss'],
})
export class AssignQuestionnaireComponent implements OnInit {
  questionnaires: questionnaire[] = [];
  selectedQuestionnaire: questionnaire | null = null;
  questionsByDomain: { [domainID: number]: Question[] } = {};
  domains: Domain[] = [];
  isModalOpen = false;
  vendors?: Vendor[];
  categorizedVendors: any[] = [];
  selectedVendors: Set<number> = new Set<number>();
  questionCountByCategory: {
    [questionnaireId: number]: { [categoryId: number]: number };
  } = {};
  allCategories: Set<number> = new Set<number>();

  // Filter-related properties
  isFilterVisible = false;
  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: ['User Id', 'Vendor Id', 'Vendor Name', 'Email Id'],
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '',
    },
  ];
  disabledCategories: Set<number> = new Set<number>();
  toggledSubParts: { [key: string]: boolean } = {};

  constructor(
    private questionnaireService: QuestionnaireService,
    private questionService: QuestionService,
    private authService: AuthService,
    private entityService: EntityService,
    private vendorService: VendorService,
    private filterService: FilterService,
    private questionnaireAssignmentService: QuestionnaireAssignmentService
  ) {}
  ngOnInit() {
    const token = this.authService.getToken();
    this.questionnaireService.getAllQuestionnaires(token).subscribe(
      (data: questionnaire[]) => {
        this.questionnaires = data;
        this.fetchQuestionCountsForAllQuestionnaires();
      },
      (error) => {
        console.error('Error fetching questionnaires', error);
      }
    );
    this.entityService.GetAllDomains(token).subscribe(
      (data: Domain[]) => {
        this.domains = data;
      },
      (error) => {
        console.error('Error fetching domains', error);
      }
    );
    this.getVendors();
    this.fetchAllCategories();
  }
  getVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe((vendors: Vendor[]) => {
      this.vendors = vendors;
      this.categorizeVendors();
    });
  }
  getCategoryClass(categoryId: number): string {
    switch (categoryId) {
      case 1:
        return 'category-1';
      case 2:
        return 'category-2';
      case 3:
        return 'category-3';
      case 4:
        return 'category-4';
      default:
        return '';
    }
  }
  categorizeVendors() {
    if (!this.vendors) return;
    const categoriesMap = new Map<
      number,
      { categoryID: number; categoryName: string; vendors: Vendor[] }
    >();
    this.vendors.forEach((vendor: Vendor) => {
      if (vendor.categoryID !== undefined) {
        if (!categoriesMap.has(vendor.categoryID)) {
          categoriesMap.set(vendor.categoryID, {
            categoryID: vendor.categoryID,
            categoryName: vendor.category?.categoryName || 'Unknown',
            vendors: [],
          });
        }
        categoriesMap.get(vendor.categoryID)?.vendors.push(vendor);
      }
    });
    this.categorizedVendors = Array.from(categoriesMap.values());
  }
  fetchAllCategories() {
    const token = this.authService.getToken();
    this.vendorService.getCategories(token).subscribe(
      (categories: any[]) => {
        categories.forEach((category) =>
          this.allCategories.add(category.categoryID)
        );
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }
  fetchQuestionCountsForAllQuestionnaires() {
    const token = this.authService.getToken();
    this.questionnaires.forEach((questionnaire) => {
      this.questionnaireService
        .getQuestionsByQuestionnaireId(questionnaire.questionnaireID!, token)
        .subscribe(
          (data: questionnaire) => {
            const questionIds = data.questionIDs;
            this.initializeQuestionCountsForQuestionnaire(
              questionnaire.questionnaireID!
            );
            this.fetchQuestionCountsByCategory(
              questionnaire.questionnaireID!,
              questionIds,
              token
            );
          },
          (error) => {
            console.error(
              `Error fetching questions for questionnaire ${questionnaire.questionnaireID}`,
              error
            );
          }
        );
    });
  }
  initializeQuestionCountsForQuestionnaire(questionnaireId: number) {
    this.questionCountByCategory[questionnaireId] = {};
    this.allCategories.forEach((categoryId) => {
      this.questionCountByCategory[questionnaireId][categoryId] = 0;
    });
  }
  fetchQuestionCountsByCategory(
    questionnaireId: number,
    questionIds: number[],
    token: string
  ) {
    questionIds.forEach((id) => {
      this.questionService.getQuestionById(id, token).subscribe(
        (question: Question) => {
          if (question.categoryID !== undefined) {
            this.questionCountByCategory[questionnaireId][
              question.categoryID
            ]++;
          }
        },
        (error) => {
          console.error(`Error fetching question with ID ${id}`, error);
        }
      );
    });
  }
  openModal(questionnaire: questionnaire) {
    this.selectedQuestionnaire = questionnaire;
    this.isModalOpen = true;
    const token = this.authService.getToken();

    this.questionnaireService
      .getQuestionsByQuestionnaireId(questionnaire.questionnaireID!, token)
      .subscribe(
        (data: questionnaire) => {
          const questionIds = data.questionIDs;
          this.questionsByDomain = {};
          this.fetchQuestionsByIds(questionIds, token);
        },
        (error) => {
          console.error('Error fetching questionnaire details', error);
        }
      );
  }
  fetchQuestionsByIds(questionIds: number[], token: string) {
    questionIds.forEach((id) => {
      this.questionService.getQuestionById(id, token).subscribe(
        (question: Question) => {
          if (!this.questionsByDomain[question.domainID]) {
            this.questionsByDomain[question.domainID] = [];
          }
          this.questionsByDomain[question.domainID].push(question);
        },
        (error) => {
          console.error(`Error fetching question with ID ${id}`, error);
        }
      );
    });
  }
  closeModal() {
    this.isModalOpen = false;
    this.questionsByDomain = {};
  }
  getDomainName(domainID: number): string {
    const domain = this.domains.find((d) => d.domainID === domainID);
    return domain ? domain.domainName : 'Unknown Domain';
  }
  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
  toggleCollapse(index: number) {
    this.categorizedVendors[index].collapsed =
      !this.categorizedVendors[index].collapsed;
  }
  isCollapseExpanded(index: number): boolean {
    return this.categorizedVendors[index]?.collapsed || false;
  }
  onVendorSelect(
    vendorID: number | undefined,
    categoryID: number | undefined
  ): void {
    if (vendorID === undefined || categoryID === undefined) return;

    // Check if the vendor is already selected
    if (this.selectedVendors.has(vendorID)) {
      this.selectedVendors.delete(vendorID);

      // If no vendors are selected in the current category, enable all categories
      const selectedInCategory = Array.from(this.selectedVendors).some((id) => {
        const vendor = this.vendors?.find((v) => v.vendorID === id);
        return vendor?.categoryID === categoryID;
      });

      if (!selectedInCategory) {
        this.disabledCategories.clear();
      }
    } else {
      this.selectedVendors.add(vendorID);

      // Disable other categories
      this.disabledCategories.clear();
      this.allCategories.forEach((catID) => {
        if (catID !== categoryID) {
          this.disabledCategories.add(catID);
        }
      });
    }
  }

  isVendorDisabled(vendor: Vendor): boolean {
    return this.disabledCategories.has(vendor.categoryID!);
  }

  isVendorSelected(vendorID: number | undefined): boolean {
    return vendorID !== undefined && this.selectedVendors.has(vendorID);
  }
  toggleSelectAll(categoryID: number): void {
    const category = this.categorizedVendors.find(
      (cat) => cat.categoryID === categoryID
    );
    if (category) {
      const allSelected = category.vendors.every((vendor: Vendor) =>
        this.isVendorSelected(vendor.vendorID)
      );
      if (allSelected) {
        category.vendors.forEach((vendor: Vendor) =>
          this.selectedVendors.delete(vendor.vendorID!)
        );
        const selectedInCategory = Array.from(this.selectedVendors).some(
          (id) => {
            const vendor = this.vendors?.find((v) => v.vendorID === id);
            return vendor?.categoryID === categoryID;
          }
        );
        if (!selectedInCategory) {
          this.disabledCategories.clear();
        }
      } else {
        category.vendors.forEach((vendor: Vendor) =>
          this.selectedVendors.add(vendor.vendorID!)
        );
        this.disabledCategories.clear();
        this.allCategories.forEach((catID) => {
          if (catID !== categoryID) {
            this.disabledCategories.add(catID);
          }
        });
      }
    }
  }

  isAllVendorsSelected(categoryID: number): boolean {
    const category = this.categorizedVendors.find(
      (cat) => cat.categoryID === categoryID
    );
    return category
      ? category.vendors.every((vendor: Vendor) =>
          this.isVendorSelected(vendor.vendorID)
        )
      : false;
  }
  getCategoryName(categoryId: number): string {
    const category = this.categorizedVendors.find(
      (cat) => cat.categoryID === categoryId
    );
    return category ? category.categoryName : 'Unknown Category';
  }
  getQuestionCountForCategory(
    questionnaireId: number,
    categoryId: number
  ): number {
    return this.questionCountByCategory[questionnaireId]?.[categoryId] || 0;
  }
  isFilterApplied(): boolean {
    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    return !!(searchBySubPart && searchBySubPart.selectedOption);
  }
  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }
  isSubPartToggled(categoryID: number): boolean {
    return !!this.toggledSubParts[categoryID];
  }
  toggleSubPart(categoryID: number): void {
    this.toggledSubParts[categoryID] = !this.toggledSubParts[categoryID];
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
