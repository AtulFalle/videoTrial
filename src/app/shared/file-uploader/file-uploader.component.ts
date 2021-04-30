import { FileUploadService } from './../../service/file-upload.service';
import { FileUploadStatus } from './../../core/enum/file-upload-status.enum';
import { SharedService } from './../../service/shared.service';
import { FileMetadata } from './../../core/models/file-upload.model';
import { Observable } from 'rxjs';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as tus from 'tus-js-client';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
  VideoTrialStoreSelectors,
} from 'src/app/root-store/video-trial-store';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

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
  fileObs: FileMetadata[] = [];

  fileObs$: Observable<FileMetadata[]>;

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.fileObs$ = this.store$.select(
      VideoTrialStoreSelectors.getUploadingFile
    );

    // tslint:disable-next-line: deprecation
    this.fileObs$.subscribe((res) => {
      console.log(res);
      this.fileObs = [...res];
      this.cdRef.detectChanges();
    });
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
        status: FileUploadStatus.IN_PROGRESS,
        progress: 0,
        fileName: item?.name,
        size: item?.size,
        blobId: [],
        chunkDetails: [],
        lastChunk: 0,
      };
      metadata.push(temp);
      this.files.push(item);
    }
    console.log(this.files);

    this.files = [...metadata];

    this.store$.dispatch(
      VideoTrialStoreActions.addFilesToUpload({ files: metadata })
    );
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
    this.store$
      .select(VideoTrialStoreSelectors.getUploadingFile)
      .pipe(take(1))
      .subscribe((res) => {
        this.sharedService.uploadFiles(res);
      });
  }

  pause(file: any): void {
    this.fileUploadService.pauseUpload(file).then((res) => {
      console.log(res);
    });
    return;
  }

  resume(file: any): void {
    this.fileUploadService.resumeUpload(file).then((res) => {
      console.log(res);
    });
    return;
  }

  getFileStatus(file: FileMetadata): Observable<string> {
    return this.store$
      .select(VideoTrialStoreSelectors.getUploadingFileByName, {
        fileName: file.fileName,
      })
      .pipe(map((res: FileMetadata) => res.status));
  }
}
