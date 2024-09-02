import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { QuestionnaireAssignmentResponseDto } from '../../model/QuestionOptionResponseDto';
@Component({
  selector: 'app-response-modal',
  templateUrl: './ResponseModal.component.html',
  styleUrls: ['./ResponseModal.component.css']
})
export class ResponseModalComponent implements OnInit {
  responses: QuestionnaireAssignmentResponseDto | undefined;

  constructor(
    public dialogRef: MatDialogRef<ResponseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { assignmentID: number },
    private responseService: ResponseService
  ) {}

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService.getResponsesForAssignment(this.data.assignmentID).subscribe(
      (responses) => {
        this.responses = responses;
      },
      (error) => {
        console.error('Error loading responses:', error);
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
