/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionnaireAssignmentService } from './questionnaireAssignment.service';

describe('Service: QuestionnaireAssignment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionnaireAssignmentService]
    });
  });

  it('should ...', inject([QuestionnaireAssignmentService], (service: QuestionnaireAssignmentService) => {
    expect(service).toBeTruthy();
  }));
});
