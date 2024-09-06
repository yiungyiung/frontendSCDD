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
  questionnaires: { [key: string]: QuestionnaireAssignmentWithVendor[] } = {};
  statuses: Status[] = [];
  token: string = 'your-auth-token';

  constructor(
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private entityService: EntityService,
    private authService: AuthService,
    private vendorService: VendorService,
    private dialog: MatDialog,
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.loadData();
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
