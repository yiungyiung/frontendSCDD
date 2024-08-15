/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VendorHierarchyService } from './vendorHierarchy.service';

describe('Service: VendorHierarchy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorHierarchyService]
    });
  });

  it('should ...', inject([VendorHierarchyService], (service: VendorHierarchyService) => {
    expect(service).toBeTruthy();
  }));
});
