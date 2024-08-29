/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataFetchService } from './DataFetch.service';

describe('Service: DataFetch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataFetchService]
    });
  });

  it('should ...', inject([DataFetchService], (service: DataFetchService) => {
    expect(service).toBeTruthy();
  }));
});
