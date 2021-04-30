import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQuestionnaireFormComponent } from './dynamic-questionnaire-form.component';

describe('DynamicQuestionnaireFormComponent', () => {
  let component: DynamicQuestionnaireFormComponent;
  let fixture: ComponentFixture<DynamicQuestionnaireFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicQuestionnaireFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQuestionnaireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
