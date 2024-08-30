/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ComplainceService } from './Complaince.service';

describe('Service: Complaince', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComplainceService]
    });
  });

  it('should ...', inject([ComplainceService], (service: ComplainceService) => {
    expect(service).toBeTruthy();
  }));
});
