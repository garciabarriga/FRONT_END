import { TestBed, inject } from '@angular/core/testing';

import { LecturasService } from './lecturas.service';

describe('LecturasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LecturasService]
    });
  });

  it('should be created', inject([LecturasService], (service: LecturasService) => {
    expect(service).toBeTruthy();
  }));
});
