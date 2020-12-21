import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropVideoComponent } from './drop-video.component';

describe('DropVideoComponent', () => {
  let component: DropVideoComponent;
  let fixture: ComponentFixture<DropVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
