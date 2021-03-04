import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnscrubbedVideoComponent } from './unscrubbed-video.component';

describe('UnscrubbedVideoComponent', () => {
  let component: UnscrubbedVideoComponent;
  let fixture: ComponentFixture<UnscrubbedVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnscrubbedVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnscrubbedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
