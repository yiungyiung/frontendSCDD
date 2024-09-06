import { Component, Input } from '@angular/core';
import { QuestionnaireAssignment } from '../../model/questionnaireAssignment';
import { Router } from '@angular/router';
import { questionnaire } from '../../model/questionnaire';

@Component({
  selector: 'app-AssignmentCard',
  templateUrl: './AssignmentCard.component.html',
  styleUrls: ['./AssignmentCard.component.css'],
})
export class AssignmentCardComponent {
  @Input() assignment!: QuestionnaireAssignment;
  @Input() questionnaireDetails?: questionnaire;

  constructor(private router: Router) {}

  onAssignmentClick(): void {
    if (this.assignment.statusID === 1) {
      this.router.navigate(['vendor/dashboard/response-page'], {
        state: { assignmentID: this.assignment.assignmentID },
      });
      return;
    }

    this.router.navigate(['/vendor/answer-questionnaire'], {
      state: {
        assignmentID: this.assignment.assignmentID,
        questionnaireID: this.assignment.questionnaireID,
      },
    });
  }
}
