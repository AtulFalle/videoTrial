import { VideoTrialInterceptor } from './core/interceptor/http.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { VideoTrialStoreModule } from './root-store/video-trial-store';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './components/home/home.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideoUploaderComponent } from './components/video-uploader/video-uploader.component';
import { AddAnnotationsComponent } from './components/add-annotations/add-annotations.component';
// import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AnnotationListComponent } from './components/annotation-list/annotation-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { DropVideoComponent } from './components/drop-video/drop-video.component';
import { ProcedureDetailsComponent } from './components/procedure-details/procedure-details.component';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PatientVideoListComponent } from './components/patient-video-list/patient-video-list.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { DragDropDirective } from './directive/drag-drop.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    VideoListComponent,
    HomeComponent,
    VideoUploaderComponent,
    AddAnnotationsComponent,
    AnnotationListComponent,
    DropVideoComponent,
    ProcedureDetailsComponent,
    PatientVideoListComponent,
    DragDropDirective,
    ProcedureDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    VideoTrialStoreModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatCardModule,
    MatSliderModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
    AngularMaterialModule,
  ],
  providers: [
    MatNativeDateModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: VideoTrialInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
