
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { VideoTrialStoreEffects } from './effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('videoTrial', reducer),
    EffectsModule.forFeature([VideoTrialStoreEffects])
  ]
})
export class VideoTrialStoreModule { }
