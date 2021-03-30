import { HttpClient } from '@angular/common/http';
import { BlobUploadResponse, FileMetadata } from './../core/models/file-upload.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { VideoTrialStoreState } from '../root-store/video-trial-store';
import { retry } from 'rxjs/operators';
import { FileUploadService } from './file-upload.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  uploaderList: any[] = [];
  currentVideoID = '';
  currentTimeObs$ = new BehaviorSubject<any>({ time: '', videoPlayerTime: '' });
  pauseVideoObs$ = new BehaviorSubject<boolean>(false);
  jumpToAnnotaion = new BehaviorSubject<string>('');

  get jumpToAnnotationTime(): Observable<string> {
    return this.jumpToAnnotaion.asObservable();
  }

  get videoStatus(): Observable<boolean> {
    return this.pauseVideoObs$.asObservable();
  }

  get currentTime(): Observable<string> {
    return this.currentTimeObs$.asObservable();
  }

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private http: HttpClient,
    private fileUpload: FileUploadService
  ) {}

  toTimeFormat(secs: string): string {
    // tslint:disable-next-line: variable-name
    const sec_num = parseInt(secs, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    const time = [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');

    return time;
  }

  uploadFiles(files: FileMetadata[]): void {
    // const thus = this;
    for (const iterator of files) {
      of(this.fileUpload.startUploading(iterator)).subscribe(res => {
        console.log(res);

      });
     //this.store$.dispatch(VideoTrialStoreActions.sendChunk({file: iterator}));

    }

  }
  startCounter(): void {
    setInterval(() => {
      console.log('this is still playing in background');
    }, 5000);
  }

  // private getTusObject(file: any, thus: this, index: number): any {
  //   return new tus.Upload(file, {
  //     // Endpoint is the upload creation URL from your tus server
  //     // endpoint: 'http://localhost:3000/files/',
  //     // endpoint: 'https://master.tus.io/files/',
  //     endpoint: 'https://localhost:44320/files/',
  //     // Retry delays will enable tus-js-client to automatically retry on errors
  //     retryDelays: [0, 3000, 5000, 10000, 20000],
  //     // metadata: {
  //     //   name: file.name,
  //     //   type: file.type,
  //     // },
  //     metadata: {
  //       name: file.name,
  //       contentType: file.type || 'application/octet-stream',
  //       emptyMetaKey: ''
  //   },
  //     onError: (error: any) => {
  //       console.log('Failed because: ' + error);
  //     },
  //     // Callback for reporting upload progress
  //     onProgress: (bytesUploaded: number, bytesTotal: number) => {
  //       const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  //       const metadata: FileMetadata = {
  //         file,
  //         status: 'IN-PROGRESS',
  //         progress: +percentage,
  //         fileName: file.name,
  //         size: file.size,
  //       };
  //       thus.store$.dispatch(
  //         VideoTrialStoreActions.updateFileProgress({ file: metadata })
  //       );
  //     },
  //     // Callback for once the upload is completed
  //     onSuccess: () => {
  //       console.log('file upload completed');
  //       const metadata: FileMetadata = {
  //         file,
  //         status: 'COMPLETED',
  //         progress: 100.0,
  //         fileName: file.name,
  //         size: file.size,
  //       };
  //       thus.store$.dispatch(
  //         VideoTrialStoreActions.updateFileProgress({ file: metadata })
  //       );
  //     },
  //     chunkSize: 100 * 1024 * 1024 * 1024,
  //   });
  // }

  pause(file: any): void {
    // this.uploaderList[index].abort();
    // const val = this.uploaderList.find((ele) => ele.file.name === file.file.name)
    //   .tus;
    // val.abort();
    // const metadata: FileMetadata = {
    //   file,
    //   status: 'PAUSED',
    //   progress: 100.0,
    //   fileName: file.name,
    //   size: file.size,
    // };
    // this.store$.dispatch(
    //   VideoTrialStoreActions.updateFileStatus({ file: metadata })
    // );
  }

  play(file: any): void {
    // this.uploaderList[index].abort();
    // const val = this.uploaderList.find((ele) => ele.file.name === file.file.name)
    //   .tus;
    // val.start();
    // const metadata: FileMetadata = {
    //   file,
    //   status: 'IN-PROGRESS',
    //   progress: 100.0,
    //   fileName: file.name,
    //   size: file.size,
    // };
    // this.store$.dispatch(
    //   VideoTrialStoreActions.updateFileStatus({ file: metadata })
    // );
  }

  appendChunk(chunk: any , file: FileMetadata): Observable<BlobUploadResponse> {
    const url = 'https://localhost:44366/api/Values/UploadFiles/' + file.fileName;
    const formData = new FormData();
    formData.append('files', chunk);
    return this.http.put<BlobUploadResponse>(url, formData).pipe(retry(3));
  }

  commitChunk(fileIdList: string[], file: any): Observable<any> {
    const url = 'https://localhost:44366/api/Values/commitFile/' + file.name;
    const body = {
      idList: fileIdList,
    };
    return this.http.post(url, body);
  }



}
