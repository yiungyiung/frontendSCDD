import { Component, OnInit } from '@angular/core';
import { Status } from '../../model/entity';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { QuestionnaireService } from '../../services/QuestionnaireService/Questionnaire.service';
import { Router } from '@angular/router';
import { ResponseModalComponent } from '../../Component/ResponseModal/ResponseModal.component';
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
  styleUrls: ['./VendorDashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  questionnaireAssignments: QuestionnaireAssignment[] = [];
  assignmentsByStatus: { [key: string]: QuestionnaireAssignment[] } = {};
  statuses: Status[] = [];
  questionnaireDetails: { [key: number]: Questionnaire } = {};

  constructor(
    private router: Router,
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private authService: AuthService,
    private vendorService: VendorService,
    private entityService: EntityService,
    private questionnaireService: QuestionnaireService,
    private dialog: MatDialog
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
        this.initializeAssignmentsByStatus(); // Initialize all statuses with empty arrays
        this.vendorService.getVendorIdByUserId(token, user.userId!).subscribe(vendorId => {
          this.questionnaireAssignmentService.getAssignmentsByVendorId(vendorId, token).subscribe(assignments => {
            this.questionnaireAssignments = assignments;
            this.mapAssignmentsToStatusNames();
            this.loadQuestionnaireDetails(token);
          });
        });
      });
    }
  }

  private initializeAssignmentsByStatus(): void {
    this.statuses.forEach(status => {
      this.assignmentsByStatus[status.statusName] = [];
    });
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
    this.questionnaireAssignments.forEach(assignment => {
      const statusName = this.getStatusNameById(assignment.statusID);
      this.assignmentsByStatus[statusName].push(assignment);
    });
  }

  private getStatusNameById(statusID?: number): string {
    const status = this.statuses.find(s => s.statusID === statusID);
    return status ? status.statusName : 'Unknown';
  }

  getStatusKeys(): string[] {
    return this.statuses.map(status => status.statusName);
  }

  getQuestionnaireDetails(questionnaireID: number): Questionnaire | undefined {
    return this.questionnaireDetails[questionnaireID];
  }

  onAssignmentClick(assignment: QuestionnaireAssignment): void {
    console.log(assignment.assignmentID);
    if (assignment.statusID === 1) {
      this.openResponseModal(assignment.assignmentID);
      return;
    }
    console.log('Navigating to answer questionnaire with ID:', assignment.questionnaireID,assignment.assignmentID);
   
    
    this.router.navigate(['/vendor/answer-questionnaire'], {state: {
      assignmentID: assignment.assignmentID,
      questionnaireID: assignment.questionnaireID
    }});
  }
  openResponseModal(assignmentID: number|undefined): void {
    this.dialog.open(ResponseModalComponent, {
      width: '600px', 
      data: { assignmentID } // Pass the questionnaireID as data to the modal
    });
  }
}