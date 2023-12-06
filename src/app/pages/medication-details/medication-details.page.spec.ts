import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicationDetailsPage } from './medication-details.page';

describe('MedicationDetailsPage', () => {
  let component: MedicationDetailsPage;
  let fixture: ComponentFixture<MedicationDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicationDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
