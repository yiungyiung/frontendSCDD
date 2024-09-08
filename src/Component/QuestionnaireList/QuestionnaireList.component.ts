import { Component, OnInit } from '@angular/core';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { Status } from '../../model/entity';
import { forkJoin } from 'rxjs';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { Router } from '@angular/router';
import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { FilterService } from '../../services/FilterService/Filter.service';
import { SubPart } from '../filter/filter.component';
interface QuestionnaireAssignmentWithVendor extends QuestionnaireAssignment {
  vendorName: string;
  questionnaireName: string;
  questionnaireYear: number;
}

@Component({
  selector: 'app-QuestionnaireList',
  templateUrl: './QuestionnaireList.component.html',
  styleUrls: ['./QuestionnaireList.component.scss'],
})
export class QuestionnaireListComponent implements OnInit {
  Questionnaires: QuestionnaireAssignmentWithVendor[] = [];
  pagedQuestionnaires: QuestionnaireAssignmentWithVendor[] = [];
  statuses: Status[] = [];
  token: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isFilterVisible = false;
  selectedColumns: string[] = [
    'Assignment ID',
    'Questionnaire ID',
    'Vendor Name',
    'Questionnaire Name',
    'Submission Date',
    'Due Date',
    'Status',
  ];
  allColumns: string[] = [
    'Assignment ID',
    'Questionnaire ID',
    'Vendor Name',
    'Questionnaire Name',
    'Submission Date',
    'Due Date',
    'Status',
  ];

  constructor(
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private authService: AuthService,
    private vendorService: VendorService,
    private modalService: ExportModalServiceService,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private filterService: FilterService,
    private entityService: EntityService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.loadStatusOptions(this.token);
    this.loadData();
  }

  loadStatusOptions(token: string): void {
    this.entityService.getAllStatuses(token).subscribe(
      (statuses: Status[]) => {
        const statusFilter = this.filterSubParts.find(
          (part) => part.name === 'Status'
        );

        if (statusFilter) {
          // Assuming each Status object has a 'name' property
          statusFilter.options = statuses.map((status) => status.statusName);
        }
      },
      (error) => {
        console.error('Error fetching status options:', error);
      }
    );
  }

  filterSubParts: SubPart[] = [
    {
      name: 'Search By',
      type: 'MCQ',
      options: [
        'Assignment Id',
        'Questionnaire ID',
        'Vendor Name',
        'Questionnaire Name',
      ],
    },
    {
      name: 'Search Keyword',
      type: 'searchBar',
      keyword: '',
    },
    {
      name: 'Status',
      type: 'checkbox',
      options: [],
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
    const statusSubPart = this.filterSubParts.find(
      (part) => part.name === 'Status'
    );
    return (
      !!(searchBySubPart && searchBySubPart.selectedOption) ||
      !!(
        statusSubPart &&
        statusSubPart.selectedOptions &&
        statusSubPart.selectedOptions.length > 0
      )
    );
  }

  onFilterChange(event: any) {
    // Prepare filter input for FilterService
    const filters = this.prepareFilters();

    // Apply filter using the FilterService
    const filteredData = this.filterService.applyFilter(
      this.Questionnaires,
      filters
    );

    // Update pagedQuestionnaires with filtered data
    this.totalItems = filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Reset to the first page
    this.pagedQuestionnaires = filteredData.slice(0, this.itemsPerPage);
  }

  // Prepare filters based on selected options in filterSubParts
  prepareFilters() {
    const filters: {
      partName: string;
      value: string | string[];
      column:
        | keyof QuestionnaireAssignmentWithVendor
        | ((item: QuestionnaireAssignmentWithVendor) => any);
      exactMatch?: boolean;
    }[] = [];

    const searchBySubPart = this.filterSubParts.find(
      (part) => part.name === 'Search By'
    );
    const searchKeywordSubPart = this.filterSubParts.find(
      (part) => part.name === 'Search Keyword'
    );
    const statusSubPart = this.filterSubParts.find(
      (part) => part.name === 'Status'
    );

    // Map the selected option to actual QuestionnaireAssignmentWithVendor object keys
    const searchByColumnMap: {
      [key: string]:
        | keyof QuestionnaireAssignmentWithVendor
        | ((item: QuestionnaireAssignmentWithVendor) => any);
    } = {
      'Assignment Id': 'assignmentID',
      'Questionnaire ID': 'questionnaireID',
      'Vendor Name': 'vendorName',
      'Questionnaire Name': 'questionnaireName',
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

    // Status Filtering
    if (
      statusSubPart &&
      statusSubPart.selectedOptions &&
      statusSubPart.selectedOptions.length > 0
    ) {
      filters.push({
        partName: 'Status',
        value: statusSubPart.selectedOptions,
        column: (item: QuestionnaireAssignmentWithVendor) =>
          item.status?.statusName || '',
      });
    }

    return filters;
  }

  openExportModal() {
    console.log(this.Questionnaires);
    const dataForExport = this.Questionnaires.map((q) => ({
      'Assignment ID': q.assignmentID,
      'Questionnaire ID': q.questionnaireID,
      'Vendor Name': q.vendor?.vendorName,
      'Questionnaire Name': q.questionnaireName,
      'Submission Date': q.submissionDate ? q.submissionDate : 'N/A',
      'Due Date': q.dueDate,
      Status: q.status?.statusName,
    }));
    this.modalService.setDataAndColumns(dataForExport, this.selectedColumns);
    this.modalService.showExportModal();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedQuestionnaires();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset to the first page
    this.updatePagedQuestionnaires();
  }

  updatePagedQuestionnaires() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedQuestionnaires = this.Questionnaires.slice(startIndex, endIndex);
  }

  paginationText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start} - ${end} of ${this.totalItems}`;
  }

  loadData(): void {
    forkJoin({
      statuses: this.entityService.getAllStatuses(this.token),
      assignments: this.questionnaireAssignmentService.getallAssignment(
        this.token
      ),
    }).subscribe(({ statuses, assignments }) => {
      this.statuses = statuses;
      this.categorizeAssignments(assignments);
    });
  }

  categorizeAssignments(assignments: QuestionnaireAssignment[]): void {
    this.Questionnaires = []; // Clear the list before merging

    assignments.forEach((assignment) => {
      forkJoin({
        vendor: this.vendorService.getVendorById(
          this.token,
          assignment.vendorID!
        ),
        questionnaire: this.questionnaireService.getQuestionsByQuestionnaireId(
          assignment.questionnaireID!,
          this.token
        ),
      }).subscribe(({ vendor, questionnaire }) => {
        const assignmentWithVendor: QuestionnaireAssignmentWithVendor = {
          ...assignment,
          vendorName: vendor.vendorName,
          questionnaireName: questionnaire.name,
          questionnaireYear: questionnaire.year,
        };

        this.Questionnaires.push(assignmentWithVendor);

        // After loading all assignments, update pagination info
        if (this.Questionnaires.length === assignments.length) {
          this.totalItems = this.Questionnaires.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.updatePagedQuestionnaires();
        }
      });
    });
  }

  openResponseModal(assignmentID: number): void {
    console.log(assignmentID);
    this.router.navigate(['admin/reports/response-page'], {
      state: {
        assignmentID: assignmentID,
      },
    });
  }
}
