import { Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcedureService } from 'src/app/core/services/procedure-service/procedure.service';
import jwt_decode from 'jwt-decode';
import { Store } from '@ngrx/store';
import { VideoTrialStoreState, VideoTrialStoreActions, VideoTrialStoreSelectors } from 'src/app/root-store/video-trial-store';
import { Site } from 'src/app/core/models/user-roles.model';

@Component({
  selector: 'app-add-procedure',
  templateUrl: './add-procedure.component.html',
  styleUrls: ['./add-procedure.component.scss'],
})
export class AddProcedureComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
  files: any[] = [];

  currentSelectedSite = '';
  currentSelectedStudy = '';

  procedureForm = this.fb.group({
    patientId: [''],
    procedureDate: [''],
    patientDob: [''],
    study: [''],
    site: [''],
    procedureType: [''],
    conductingSurgeon: [''],
    surgicalDeviceLiaison: [''],
  });
  userRole = '';
  studyList: any;
  roleList: any;

  constructor(
    private fb: FormBuilder,
    private procedureService: ProcedureService,
    private router: Router,
    private store$: Store<VideoTrialStoreState.State>,

  ) {}

  processing = false;

  ngOnInit(): void {
   this.store$.dispatch( VideoTrialStoreActions.getUserMetadata());
   this.studyList = this.store$.select(VideoTrialStoreSelectors.getStudyList);
   this.roleList = this.store$.select(VideoTrialStoreSelectors.getSiteList);
   this.store$.select(VideoTrialStoreSelectors.getSiteList).subscribe(res => {
     console.log('inside subscribe componant');

     console.log(res);

   })
   this.store$.select(VideoTrialStoreSelectors.getSiteList).subscribe(res => {
     console.log(res);

   });

  }

  studyUpdate(e: any) {
    console.log(e);
    this.store$.dispatch( VideoTrialStoreActions.updateSelectedStudy({study: e.value}));


  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    this.prepareFilesList(event.target.files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = '';
  }

  /**
   * Simulate the upload process
   */
  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index === this.files.length) {
  //       return;
  //     } else {
  //       const progressInterval = setInterval(() => {
  //         if (this.files[index].progress === 100) {
  //           clearInterval(progressInterval);
  //           this.uploadFilesSimulator(index + 1);
  //         } else {
  //           this.files[index].progress += 5;
  //         }
  //       }, 200);
  //     }
  //   }, 1000);
  // }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  onSubmit() {
    if (this.procedureForm.invalid) {
      return false;
    }
    const formData = this.toFormData(this.procedureForm.value, this.files);
    return this.procedureService
      .createProcedure(formData)
      .subscribe((procedure) => this.router.navigate(['procedures-list']));
  }

  toFormData(formValue: any, videos: any[]) {
    const formData = new FormData();
    const formValueCopy = { ...formValue };
    formValueCopy.procedureDate = formValueCopy.procedureDate.toISOString();
    formValueCopy.patientDob = formValueCopy.patientDob.toISOString();

    for (const key of Object.keys(formValueCopy)) {
      const value = formValueCopy[key];
      formData.append(key, value);
    }
    videos.forEach((video) => {
      formData.append('videos', video, video.name);
    });
    return formData;
  }
}
