import { Component, OnInit } from '@angular/core';
import { Status } from '../../model/entity'; // Import Status model
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment'; // Import QuestionnaireAssignment model
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { HttpHeaders } from '@angular/common/http'; // Import HttpHeaders if not already done
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { Router } from '@angular/router';

interface Questionnaire {
  questionnaireID?: number;
  name: string;
  year: number;
  questionIDs: number[];
}

@Component({
  selector: 'app-VendorDashboard',
  templateUrl: './VendorDashboard.component.html',
  styleUrls: ['./VendorDashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  questionnaireAssignments: QuestionnaireAssignment[] = [];
  assignmentsByStatus: { [key: string]: QuestionnaireAssignment[] } = {};
  statuses: Status[] = [];
  questionnaireDetails: { [key: number]: Questionnaire } = {}; // Map to store questionnaire details

  constructor(
    private router: Router,
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private authService: AuthService,
    private vendorService: VendorService,
    private entityService: EntityService, // Inject EntityService to fetch statuses
    private questionnaireService: QuestionnaireService
  ) { }

  ngOnInit() {
    this.loadStatusesAndAssignments();
  }

  private loadStatusesAndAssignments(): void {
    const token = this.authService.getToken();
    const user = this.authService.getCurrentUser();

    if (user && token) {
      this.entityService.getAllStatuses(token).subscribe(statuses => {
        this.statuses = statuses;
        this.vendorService.getVendorIdByUserId(token, user.userId!).subscribe(vendorId => {
          this.questionnaireAssignmentService.getAssignmentsByVendorId(vendorId, token).subscribe(assignments => {
            this.questionnaireAssignments = assignments;
            this.mapAssignmentsToStatusNames();
            this.loadQuestionnaireDetails(token); // Fetch questionnaire details after assignments are loaded
          });
        });
      });
    }
  }

  private loadQuestionnaireDetails(token: string): void {
    const uniqueQuestionnaireIDs = [...new Set(this.questionnaireAssignments.map(a => a.questionnaireID))];

    uniqueQuestionnaireIDs.forEach(questionnaireID => {
      this.questionnaireService.getQuestionsByQuestionnaireId(questionnaireID, token).subscribe(questionnaire => {
        this.questionnaireDetails[questionnaireID] = questionnaire;
      });
    });
  }
  private mapAssignmentsToStatusNames(): void {
    this.assignmentsByStatus = this.questionnaireAssignments.reduce((acc, assignment) => {
      const statusName = this.getStatusNameById(assignment.statusID);
      if (!acc[statusName]) {
        acc[statusName] = [];
      }
      acc[statusName].push(assignment);
      return acc;
    }, {} as { [key: string]: QuestionnaireAssignment[] });
  }

  private getStatusNameById(statusID?: number): string {
    const status = this.statuses.find(s => s.statusID === statusID);
    return status ? status.statusName : 'Unknown';
  }

  getStatusKeys(): string[] {
    return Object.keys(this.assignmentsByStatus);
  }

  getQuestionnaireDetails(questionnaireID: number): Questionnaire | undefined {
    return this.questionnaireDetails[questionnaireID];
  }
  onAssignmentClick(assignment: QuestionnaireAssignment): void {
    console.log('Navigating to answer questionnaire with ID:', assignment.questionnaireID);
    this.router.navigate(['/vendor/answer-questionnaire', assignment.questionnaireID]);
  }
}
