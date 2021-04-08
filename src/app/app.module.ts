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
import { ProcedureDetailsComponent } from './components/procedure-details/procedure-details.component';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PatientVideoListComponent } from './components/patient-video-list/patient-video-list.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { DragDropDirective } from './directive/drag-drop.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddProcedureComponent } from './components/add-procedure/add-procedure.component';
import { ProceduresListComponent } from './components/procedures-list/procedures-list.component';
import { UnscrubbedVideoComponent } from './components/unscrubbed-video/unscrubbed-video.component';
import { LoginComponent } from './components/login/login.component';
import {
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';

import { b2cPolicies, apiConfig } from './b2c-config';
import {
  LogLevel,
  IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation,
  InteractionType,
} from '@azure/msal-browser';
import { FileUploaderComponent } from './shared/file-uploader/file-uploader.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';  // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { NotAuthorizedComponent } from './authentication/not-authorized/not-authorized.component';
import { NgIdleModule } from '@ng-idle/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'a39f9378-d595-42ad-b773-422b79502a9c',
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: 'http://localhost:4200/home',
      postLogoutRedirectUri: 'http://localhost:4200',
      knownAuthorities: [b2cPolicies.authorityDomain],
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(apiConfig.uri, apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...apiConfig.scopes],
    },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    VideoListComponent,
    HomeComponent,
    AddAnnotationsComponent,
    AnnotationListComponent,
    ProcedureDetailsComponent,
    PatientVideoListComponent,
    DragDropDirective,
    ProcedureDetailsComponent,
    AddProcedureComponent,
    ProceduresListComponent,
    UnscrubbedVideoComponent,
    LoginComponent,
    FileUploaderComponent,
    NotAuthorizedComponent,
    AlertDialogComponent,
 
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
    NgIdleKeepaliveModule.forRoot(),
    NgIdleModule.forRoot(),
    MatIconModule,
    MatDialogModule,
    // NgbModule
  ],
  providers: [
    MatNativeDateModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: VideoTrialInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
