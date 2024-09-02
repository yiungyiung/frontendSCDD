import { Component, OnInit } from '@angular/core';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { Status } from '../../model/entity';
import { forkJoin } from 'rxjs';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { VendorService } from '../../services/VendorService/Vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponseModalComponent } from '../ResponseModal/ResponseModal.component';

interface QuestionnaireAssignmentWithVendor extends QuestionnaireAssignment {
  vendorName: string;
}

@Component({
  selector: 'app-QuestionnaireList',
  templateUrl: './QuestionnaireList.component.html',
  styleUrls: ['./QuestionnaireList.component.css']
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      statuses: this.entityService.getAllStatuses(this.token),
      assignments: this.questionnaireAssignmentService.getallAssignment(this.token)
    }).subscribe(({ statuses, assignments }) => {
      this.statuses = statuses;
      this.categorizeAssignments(assignments);
    });
  }

  categorizeAssignments(assignments: QuestionnaireAssignment[]): void {
    this.statuses.forEach(status => {
      this.questionnaires[status.statusName] = [];

      assignments
        .filter(assignment => assignment.statusID === status.statusID)
        .forEach(assignment => {
          this.vendorService.getVendorById(this.token, assignment.vendorID!).subscribe(vendor => {
            const assignmentWithVendor: QuestionnaireAssignmentWithVendor = {
              ...assignment,
              vendorName: vendor.vendorName
            };
            this.questionnaires[status.statusName].push(assignmentWithVendor);
          });
        });
    });
  }

  openResponseModal(assignmentID: number): void {
    const dialogRef = this.dialog.open(ResponseModalComponent, {
      width: '600px',
      data: { assignmentID }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
