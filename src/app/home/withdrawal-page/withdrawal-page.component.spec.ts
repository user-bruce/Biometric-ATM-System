import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalPageComponent } from './withdrawal-page.component';

describe('WithdrawalPageComponent', () => {
  let component: WithdrawalPageComponent;
  let fixture: ComponentFixture<WithdrawalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
