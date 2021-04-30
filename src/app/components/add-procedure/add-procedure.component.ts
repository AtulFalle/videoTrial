import { Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcedureService } from 'src/app/core/services/procedure-service/procedure.service';
import jwt_decode from 'jwt-decode';
import { Store } from '@ngrx/store';
import {
  VideoTrialStoreState,
  VideoTrialStoreActions,
  VideoTrialStoreSelectors,
} from 'src/app/root-store/video-trial-store';
import { FileMetadata } from 'src/app/core/models/file-upload.model';
import { Procedure } from 'src/app/core/models/procedure.model';
import { take } from 'rxjs/operators';
import { Video } from 'src/app/core/models/video.model';
import { v4 as uuidv4 } from 'uuid';

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
    private store$: Store<VideoTrialStoreState.State>
  ) {}

  processing = false;

  ngOnInit(): void {
    // this.store$.dispatch(VideoTrialStoreActions.getUserMetadata());
    this.store$.dispatch(VideoTrialStoreActions.getUserDetails());
    this.studyList = this.store$.select(VideoTrialStoreSelectors.getStudyList);
    this.roleList = this.store$.select(VideoTrialStoreSelectors.getSiteList);
    this.store$
      .select(VideoTrialStoreSelectors.getSiteList)
      .subscribe((res) => {
        console.log('inside subscribe componant');

        console.log(res);
      });
    this.store$
      .select(VideoTrialStoreSelectors.getSiteList)
      .subscribe((res) => {
        console.log(res);
      });
  }

  studyUpdate(e: any) {
    console.log(e);
    this.store$.dispatch(
      VideoTrialStoreActions.updateSelectedStudy({ study: e.value })
    );
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

  onSubmit(): void {
    if (this.procedureForm.invalid) {
      return;
    }

    this.store$
      .select(VideoTrialStoreSelectors.getUploadingFile)
      .pipe(take(1))
      .subscribe((metadataList: FileMetadata[]) => {
        const videoUrl = [];
        for (const iterator of metadataList) {
          videoUrl.push({ url: iterator.url, name: iterator.fileName});
        }
        const procedure: Procedure = this.createProcedureDto(
          this.procedureForm.value,
          videoUrl
        );
       // const formData = this.toFormData(this.procedureForm.value, videoUrl);
        return this.procedureService
          .createProcedure(procedure)
          .subscribe((procedure) => this.router.navigate(['procedures-list']));
      }, e=> {
        console.log(e);

      });
  }
  createProcedureDto(value: any, videoUrl: {url: string; name: string}[]): Procedure {
    const videoList: Video[] = [];
    for (const iterator of videoUrl) {

      const temp: Video = {
        videoId: uuidv4(),
        name: iterator.name,
        amsUrl: iterator.url,
        annotations: []
      }
      videoList.push(temp);
    }

    const procedure: any = {
      patientId: value.patientId,
      procedureDate: value.procedureDate.toISOString(),
      patientDob: value.patientDob.toISOString(),
      study: value.study,
      site: value.site,
      procedureType: value.procedureType,
      conductingSurgeon: value.conductingSurgeon,
      surgicalDeviceLiaison: value.surgicalDeviceLiaison,
      video: videoList,
    };

    return procedure;
  }

  toFormData(formValue: any, videos: string[]) {
    const formData = new FormData();
    const formValueCopy = { ...formValue };
    formValueCopy.procedureDate = formValueCopy.procedureDate.toISOString();
    formValueCopy.patientDob = formValueCopy.patientDob.toISOString();

    for (const key of Object.keys(formValueCopy)) {
      const value = formValueCopy[key];
      formData.append(key, value);
    }
    videos.forEach((video) => {
      formData.append('videos', video);
    });
    return formData;
  }
}
