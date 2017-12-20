import { TestBed, inject } from '@angular/core/testing';

import { HeartbitApiService } from './heartbit-api.service';

describe('HeartbitApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeartbitApiService]
    });
  });

  it('should be created', inject([HeartbitApiService], (service: HeartbitApiService) => {
    expect(service).toBeTruthy();
    expect(service.listPatients()).toBeDefined();
  }));
});
