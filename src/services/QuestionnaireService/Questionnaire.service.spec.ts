/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionnaireService } from './Questionnaire.service';

describe('Service: Questionnaire', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionnaireService]
    });
  });

  it('should ...', inject([QuestionnaireService], (service: QuestionnaireService) => {
    expect(service).toBeTruthy();
  }));
});
