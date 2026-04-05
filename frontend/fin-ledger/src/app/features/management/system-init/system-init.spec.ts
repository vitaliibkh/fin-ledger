import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInit } from './system-init';

describe('SystemInit', () => {
  let component: SystemInit;
  let fixture: ComponentFixture<SystemInit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemInit],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemInit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
