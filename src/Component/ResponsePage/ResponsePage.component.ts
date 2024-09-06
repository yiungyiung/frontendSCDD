import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { QuestionnaireAssignmentResponseDto } from '../../model/QuestionOptionResponseDto';
import { Location } from '@angular/common';
@Component({
  selector: 'app-ResponsePage',
  templateUrl: './ResponsePage.component.html',
  styleUrls: ['./ResponsePage.component.css'],
})
export class ResponsePageComponent implements OnInit {
  assignmentID: number | undefined;
  responses: QuestionnaireAssignmentResponseDto | undefined;
  constructor(
    private router: Router,
    private responseService: ResponseService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.assignmentID = state.assignmentID;

    this.loadResponses();
  }
  loadResponses(): void {
    this.responseService
      .getResponsesForAssignment(this.assignmentID!)
      .subscribe(
        (responses) => {
          this.responses = responses;
        },
        (error) => {
          console.error('Error loading responses:', error);
        }
      );
  }
  goBack(): void {
    this.location.back();
  }
}
