import { Component, OnInit } from '@angular/core';
import { Status } from '../../model/entity';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

interface Questionnaire {
  questionnaireID?: number;
  name: string;
  year: number;
  questionIDs: number[];
}

@Component({
  selector: 'app-VendorDashboard',
  templateUrl: './VendorDashboard.component.html',
  styleUrls: ['./VendorDashboard.component.scss'],
})
export class VendorDashboardComponent implements OnInit {
  // Arrays and objects to store questionnaire assignments and related details
  questionnaireAssignments: QuestionnaireAssignment[] = [];
  assignmentsByStatus: { [key: string]: QuestionnaireAssignment[] } = {};
  statuses: Status[] = [];
  questionnaireDetails: { [key: number]: Questionnaire } = {};
  isChildRouteActive = false;

  constructor(
    private router: Router,
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private authService: AuthService,
    private vendorService: VendorService,
    private entityService: EntityService,
    private questionnaireService: QuestionnaireService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if a child route is active and load statuses and assignments
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isChildRouteActive = this.route.firstChild != null;
      }
    });
    this.loadStatusesAndAssignments();
  }

  // Load statuses and questionnaire assignments
  private loadStatusesAndAssignments(): void {
    const token = this.authService.getToken();
    const user = this.authService.getCurrentUser();

    if (user && token) {
      // Fetch all statuses and initialize assignments by status
      this.entityService.getAllStatuses(token).subscribe((statuses) => {
        this.statuses = statuses;
        this.initializeAssignmentsByStatus();

        // Fetch vendor ID and then get assignments for the vendor
        this.vendorService
          .getVendorIdByUserId(token, user.userId!)
          .subscribe((vendorId) => {
            this.questionnaireAssignmentService
              .getAssignmentsByVendorId(vendorId, token)
              .subscribe((assignments) => {
                this.questionnaireAssignments = assignments;
                this.mapAssignmentsToStatusNames();
                this.loadQuestionnaireDetails(token);
              });
          });
      });
    }
  }

  // Initialize assignmentsByStatus based on statuses
  private initializeAssignmentsByStatus(): void {
    this.statuses.forEach((status) => {
      this.assignmentsByStatus[status.statusName] = [];
    });
  }

  // Load details of each questionnaire
  private loadQuestionnaireDetails(token: string): void {
    const uniqueQuestionnaireIDs = [
      ...new Set(this.questionnaireAssignments.map((a) => a.questionnaireID)),
    ];

    uniqueQuestionnaireIDs.forEach((questionnaireID) => {
      this.questionnaireService
        .getQuestionsByQuestionnaireId(questionnaireID, token)
        .subscribe((questionnaire) => {
          this.questionnaireDetails[questionnaireID] = questionnaire;
        });
    });
  }

  // Map assignments to status names
  private mapAssignmentsToStatusNames(): void {
    this.questionnaireAssignments.forEach((assignment) => {
      const statusName = this.getStatusNameById(assignment.statusID);
      this.assignmentsByStatus[statusName].push(assignment);
    });
  }

  // Get status name based on status ID
  private getStatusNameById(statusID?: number): string {
    const status = this.statuses.find((s) => s.statusID === statusID);
    return status ? status.statusName : 'Unknown';
  }

  // Get a list of status names
  getStatusKeys(): string[] {
    return this.statuses.map((status) => status.statusName);
  }

  // Get details of a questionnaire by ID
  getQuestionnaireDetails(questionnaireID: number): Questionnaire | undefined {
    return this.questionnaireDetails[questionnaireID];
  }

  // Handle the click event for an assignment
  onAssignmentClick(assignment: QuestionnaireAssignment): void {
    console.log(assignment.assignmentID);
    if (assignment.statusID === 1) {
      this.openResponseModal(assignment.assignmentID);
      return;
    }
    console.log(
      'Navigating to answer questionnaire with ID:',
      assignment.questionnaireID,
      assignment.assignmentID
    );

    // Navigate to answer questionnaire page with state
    this.router.navigate(['/vendor/answer-questionnaire'], {
      state: {
        assignmentID: assignment.assignmentID,
        questionnaireID: assignment.questionnaireID,
      },
    });
  }

  // Open a modal for responses
  openResponseModal(assignmentID: number | undefined): void {
    this.router.navigate(['vendor/dashboard/response-page'], {
      state: {
        assignmentID: assignmentID,
      },
    });
  }
}
