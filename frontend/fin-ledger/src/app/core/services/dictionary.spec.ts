import { TestBed } from '@angular/core/testing';

import { Dictionary } from './dictionary';

describe('Dictionary', () => {
  let service: Dictionary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dictionary);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
