import { TestBed } from '@angular/core/testing';

import { Counterparty } from './counterparty';

describe('Counterparty', () => {
  let service: Counterparty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Counterparty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
