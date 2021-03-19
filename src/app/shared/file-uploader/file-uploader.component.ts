import { SharedService } from './../../service/shared.service';
import { FileMetadata } from './../../core/models/file-upload.model';
import { Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as tus from 'tus-js-client';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
  VideoTrialStoreSelectors,
} from 'src/app/root-store/video-trial-store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;

  files: any[] = [];
  processing = false;
  isUploading = false;
  upload: tus.Upload;
  isCompleted = false;
  percentage = '0';
  uploadList: any[] = [];

  fileObs$: Observable<FileMetadata[]>;

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fileObs$ = this.store$.select(
      VideoTrialStoreSelectors.getUploadingFile
    );
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any): void {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any): void {
    this.prepareFilesList(event.target.files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>): void {
    this.percentage = '0';
    this.processing = true;
    this.isUploading = true;
    this.isCompleted = false;
    const metadata: FileMetadata[] = [];
    for (const item of files) {
      console.log(item);

      const temp: FileMetadata = {
        file: item,
        status: 'SELECTED',
        progress: 0,
        fileName: item?.name,
        size: item?.size,
      };
      metadata.push(temp);
      this.files.push(item);
    }
    console.log(this.files);

    this.store$.dispatch(
      VideoTrialStoreActions.addFilesToUpload({ files: metadata })
    );

    // this.fileDropEl.nativeElement.value = '';
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2): number | string {
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
  deleteFile(index: number): void {
    if (this.files[index].progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
    this.uploadList.splice(index, 1);
  }

  uploaadFiles(): void {
    this.sharedService.uploadFiles(this.files);
    return;
  }

  private getTusObject(file: any, thus: this, index: number): any {
    return new tus.Upload(file, {
      // Endpoint is the upload creation URL from your tus server
      // endpoint: 'http://localhost:3000/files/',
      // endpoint: 'https://master.tus.io/files/',
      endpoint: 'https://master.tus.io/files/',
      // Retry delays will enable tus-js-client to automatically retry on errors
      retryDelays: [0, 3000, 5000, 10000, 20000],
      // fileReader: temp,
      // Attach additional meta data about the file for the server
      metadata: {
        name: file.name,
        type: file.type,
      },
      // parallelUploads: 2,
      // Callback for errors which cannot be fixed using retries
      onError: (error: any) => {
        console.log('Failed because: ' + error);
      },
      // Callback for reporting upload progress
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + '%');
        thus.files[index].progress = percentage;
        thus.files[index].percentage = percentage;
        thus.files[index].isUploading = true;
        thus.files[index].isCompleted = false;
        thus.files[index].processing = true;
      },
      // Callback for once the upload is completed
      onSuccess: () => {
        console.log('file upload completed');
        // thus.processing = false;
        // thus.isCompleted = true;
        thus.files[index].processing = false;

        thus.files[index].isUploading = false;
        thus.files[index].isCompleted = true;
      },
      chunkSize: 100 * 1024 * 1024 * 1024,
    });
  }

  pause(file: any): void {
    // this.sharedService.uploaderList[index].a/bort();

    // this.store$.dispatch(Video)
    this.sharedService.pause(file);
    return;
    // this.uploadList[index].abort();
    // this.files[index].isUploading = false;
    // this.isUploading = false;
  }

  resume(file: any): void {
    this.sharedService.play(file);
    // this.sharedService.uploaderList[index].start();
    return;
    // this.uploadList[index].start();
    // this.isUploading = true;
    // this.files[index].isUploading = true;
  }
}
