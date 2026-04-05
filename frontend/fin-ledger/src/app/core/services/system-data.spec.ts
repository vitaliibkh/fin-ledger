import { TestBed } from '@angular/core/testing';

import { SystemData } from './system-data';

describe('SystemData', () => {
  let service: SystemData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
