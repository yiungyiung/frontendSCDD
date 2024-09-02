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
  responses: QuestionnaireAssignmentResponseDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<ResponseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questionnaireID: number },
    private responseService: ResponseService
  ) {}

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService.getAllResponsesForQuestionnaire(this.data.questionnaireID).subscribe(
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
