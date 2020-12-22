import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVideoListComponent } from './patient-video-list.component';

describe('PatientVideoListComponent', () => {
  let component: PatientVideoListComponent;
  let fixture: ComponentFixture<PatientVideoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVideoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
