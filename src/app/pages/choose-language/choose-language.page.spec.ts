import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseLanguagePage } from './choose-language.page';

describe('ChooseLanguagePage', () => {
  let component: ChooseLanguagePage;
  let fixture: ComponentFixture<ChooseLanguagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChooseLanguagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
