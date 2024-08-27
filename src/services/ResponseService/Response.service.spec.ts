/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ResponseService } from './Response.service';

describe('Service: Response', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponseService]
    });
  });

  it('should ...', inject([ResponseService], (service: ResponseService) => {
    expect(service).toBeTruthy();
  }));
});
