/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EntityService } from './Entity.service';

describe('Service: Entity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntityService]
    });
  });

  it('should ...', inject([EntityService], (service: EntityService) => {
    expect(service).toBeTruthy();
  }));
});
