import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureMediaPlayerComponent } from './azure-media-player.component';

describe('AzureMediaPlayerComponent', () => {
  let component: AzureMediaPlayerComponent;
  let fixture: ComponentFixture<AzureMediaPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AzureMediaPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AzureMediaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
