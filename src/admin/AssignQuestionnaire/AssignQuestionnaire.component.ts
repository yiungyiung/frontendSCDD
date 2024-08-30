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
@Component({
  selector: 'app-AssignQuestionnaire',
  templateUrl: './AssignQuestionnaire.component.html',
  styleUrls: ['./AssignQuestionnaire.component.css']
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

  constructor(
    private questionnaireService: QuestionnaireService,
    private questionService: QuestionService,
    private authService: AuthService,
    private entityService: EntityService,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();

    // Fetch all questionnaires
    this.questionnaireService.getAllQuestionnaires(token).subscribe(
      (data: questionnaire[]) => {
        this.questionnaires = data;
      },
      error => {
        console.error('Error fetching questionnaires', error);
      }
    );

    // Fetch all domains
    this.entityService.GetAllDomains(token).subscribe(
      (data: Domain[]) => {
        this.domains = data;
      },
      error => {
        console.error('Error fetching domains', error);
      }
    );

    // Fetch all vendors
    this.getVendors();
  }

  getVendors() {
    const token = this.authService.getToken();
    this.vendorService.getAllVendors(token).subscribe((vendors: Vendor[]) => {
      this.vendors = vendors;
      this.categorizeVendors();
    });
  }

  categorizeVendors() {
    if (!this.vendors) return;

    const categoriesMap = new Map<number, { categoryID: number; categoryName: string; vendors: Vendor[] }>();

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

  openModal(questionnaire: questionnaire) {
    this.selectedQuestionnaire = questionnaire;
    this.isModalOpen = true;
    const token = this.authService.getToken();

    this.questionnaireService.getQuestionsByQuestionnaireId(questionnaire.questionnaireID!, token).subscribe(
      (data: questionnaire) => {
        const questionIds = data.questionIDs;
        this.questionsByDomain = {};
        this.fetchQuestionsByIds(questionIds, token);
      },
      error => {
        console.error('Error fetching questionnaire details', error);
      }
    );
  }

  fetchQuestionsByIds(questionIds: number[], token: string) {
    questionIds.forEach(id => {
      this.questionService.getQuestionById(id, token).subscribe(
        (question: Question) => {
          if (!this.questionsByDomain[question.domainID]) {
            this.questionsByDomain[question.domainID] = [];
          }
          this.questionsByDomain[question.domainID].push(question);
        },
        error => {
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
    const domain = this.domains.find(d => d.domainID === domainID);
    return domain ? domain.domainName : 'Unknown Domain';
  }

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
  toggleCollapse(index: number) {
    this.categorizedVendors[index].collapsed = !this.categorizedVendors[index].collapsed;
  }

  isCollapseExpanded(index: number): boolean {
    return this.categorizedVendors[index]?.collapsed || false;
  }

  onVendorSelect(vendorID: number | undefined): void {
    if (vendorID === undefined) return;

    if (this.selectedVendors.has(vendorID)) {
      this.selectedVendors.delete(vendorID);
    } else {
      this.selectedVendors.add(vendorID);
    }
  }

  isVendorSelected(vendorID: number | undefined): boolean {
    return vendorID !== undefined && this.selectedVendors.has(vendorID);
  }

  toggleSelectAll(categoryID: number): void {
    const category = this.categorizedVendors.find(cat => cat.categoryID === categoryID);
    if (category) {
      const allSelected = category.vendors.every((vendor:Vendor) => this.isVendorSelected(vendor.vendorID));
      if (allSelected) {
        category.vendors.forEach((vendor:Vendor) => this.selectedVendors.delete(vendor.vendorID!));
      } else {
        category.vendors.forEach((vendor:Vendor) => this.selectedVendors.add(vendor.vendorID!));
      }
    }
  }

  isAllVendorsSelected(categoryID: number): boolean {
    const category = this.categorizedVendors.find(cat => cat.categoryID === categoryID);
    return category
      ? category.vendors.every((vendor:Vendor) => this.isVendorSelected(vendor.vendorID))
      : false;
  }
  
}
