/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExportModalServiceService } from './ExportModalService.service';

describe('Service: ExportModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportModalServiceService]
    });
  });

  it('should ...', inject([ExportModalServiceService], (service: ExportModalServiceService) => {
    expect(service).toBeTruthy();
  }));
});
