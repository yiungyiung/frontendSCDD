import { Component, OnInit } from '@angular/core';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { Status } from '../../model/entity';
import { forkJoin } from 'rxjs';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { MatDialog } from '@angular/material/dialog';

import { ExportModalServiceService } from '../../services/ExportModalService/ExportModalService.service';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { Router } from '@angular/router';
interface QuestionnaireAssignmentWithVendor extends QuestionnaireAssignment {
  vendorName: string;
  questionnaireName: string;
  questionnaireYear: number;
}

@Component({
  selector: 'app-QuestionnaireTable',
  templateUrl: './QuestionnaireTable.component.html',
  styleUrls: ['./QuestionnaireTable.component.scss'],
})
export class QuestionnaireTableComponent implements OnInit {
  questionnaires: { [key: string]: QuestionnaireAssignmentWithVendor[] } = {};
  pagedQuestionnaires: { [key: string]: QuestionnaireAssignmentWithVendor[] } =
    {};
  statuses: Status[] = [];
  token: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
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
    private entityService: EntityService,
    private authService: AuthService,
    private vendorService: VendorService,
    private dialog: MatDialog,
    private modalService: ExportModalServiceService,
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.loadData();
  }
  openExportModal() {
    const data = Object.values(this.questionnaires).flat();
    this.modalService.setDataAndColumns(data, this.selectedColumns);
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
    this.pagedQuestionnaires = {};

    Object.keys(this.questionnaires).forEach((statusName) => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      this.pagedQuestionnaires[statusName] = this.questionnaires[
        statusName
      ].slice(startIndex, endIndex);
    });

    // Update total pages based on the paged data
    const totalItems = Object.values(this.questionnaires).flat().length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
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
    this.statuses.forEach((status) => {
      this.questionnaires[status.statusName] = [];

      assignments
        .filter((assignment) => assignment.statusID === status.statusID)
        .forEach((assignment) => {
          forkJoin({
            vendor: this.vendorService.getVendorById(
              this.token,
              assignment.vendorID!
            ),
            questionnaire:
              this.questionnaireService.getQuestionsByQuestionnaireId(
                assignment.questionnaireID!,
                this.token
              ),
          }).subscribe(({ vendor, questionnaire }) => {
            const assignmentWithVendor: QuestionnaireAssignmentWithVendor = {
              ...assignment,
              vendorName: vendor.vendorName,
              questionnaireName: questionnaire.name,
              questionnaireYear: questionnaire.year, // Assigning the questionnaire name
            };
            this.questionnaires[status.statusName].push(assignmentWithVendor);

            this.updatePagedQuestionnaires();
          });
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
