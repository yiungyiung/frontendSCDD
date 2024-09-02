import { Component, OnInit } from '@angular/core';
import { QuestionnaireAssignmentService } from '../../services/QuestionnaireAssignmentService/questionnaireAssignment.service';
import { ReportStateService } from '../../services/ReportState/ReportState.service';
import { AuthService } from '../../services/AuthService/auth.service';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';

@Component({
  selector: 'app-DynamicVendorList',
  templateUrl: './DynamicVendorList.component.html',
  styleUrls: ['./DynamicVendorList.component.css']
})
export class DynamicVendorListComponent implements OnInit {
  vendorAssignments: QuestionnaireAssignment[] = [];
  selectedVendorAssignments: { vendorID: number, assignmentID: number, vendorName: string }[] = [];
  token: string = '';

  constructor(
    private questionnaireAssignmentService: QuestionnaireAssignmentService,
    private reportStateService: ReportStateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.authService.getToken();
    this.reportStateService.selectedQuestionnaire$.subscribe(questionnaireId => {
      if (questionnaireId) {
        this.loadVendors(questionnaireId);
      }
    });

    this.reportStateService.selectedVendorAssignments$.subscribe((vendorAssignments) => {
      this.selectedVendorAssignments = vendorAssignments;
    });
  }

  loadVendors(questionnaireId: number) {
    this.questionnaireAssignmentService.getAssignmentsByQuestionnaireId(questionnaireId, this.token)
      .subscribe((assignments: QuestionnaireAssignment[]) => {
        // Filter assignments based on statusID
        this.vendorAssignments = assignments.filter(assignment => assignment.statusID === 1);
      });
  }

  isVendorSelected(vendorId: number, assignmentId: number): boolean {
    return this.selectedVendorAssignments.some(v => v.vendorID === vendorId && v.assignmentID === assignmentId);
  }

  onVendorSelect(vendorId: number, assignmentId: number, vendorName: string) {
    const index = this.selectedVendorAssignments.findIndex(v => v.vendorID === vendorId && v.assignmentID === assignmentId);
    if (index === -1) {
      this.selectedVendorAssignments.push({ vendorID: vendorId, assignmentID: assignmentId, vendorName });
    } else {
      this.selectedVendorAssignments.splice(index, 1);
    }
    this.reportStateService.selectVendorAssignments(this.selectedVendorAssignments);
  }
}
