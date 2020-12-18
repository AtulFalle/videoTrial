import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnotationsComponent } from './add-annotations.component';

describe('AddAnnotationsComponent', () => {
  let component: AddAnnotationsComponent;
  let fixture: ComponentFixture<AddAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAnnotationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
