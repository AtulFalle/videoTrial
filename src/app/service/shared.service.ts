import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, retry } from 'rxjs/operators';
import { FileUploadService } from './file-upload.service';
import { User } from '../core/models/admin.model';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import {
  FileMetadata,
  BlobUploadResponse,
} from './../core/models/file-upload.model';
import { EmailNotify } from '../core/models/email-notify.model';
import { Store } from '@ngrx/store';
import { VideoTrialStoreState } from '../root-store/video-trial-store';

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
    private fileUpload: FileUploadService,
    private store$: Store<VideoTrialStoreState.State>,
    private http: HttpClient
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
    for (const iterator of files) {
      of(this.fileUpload.startUploading(iterator)).subscribe((res) => {
        console.log(res);
        res.then((e) => {
          console.log(e);
        });
      });
    }
  }
  startCounter(): void {
    setInterval(() => {
      console.log('this is still playing in background');
    }, 5000);
  }

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

  appendChunk(chunk: any, file: FileMetadata): Observable<BlobUploadResponse> {
    const url =
      'https://localhost:44366/api/Values/UploadFiles/' + file.fileName;
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

  getUserById(): Observable<User[]> {
    const id: any = jwt_decode(sessionStorage.getItem('token')) || '';
    const url = `https://biogenbackendapi.azurewebsites.net//filterRequestedAccounts?reqStatus=false`;
    return this.http.get<User[]>(url);
  }

  sendEmailNotification(token: any): Observable<any> {
    console.log(token);

    const body: EmailNotify = {
      givenName: token.given_name,
      surname: token.family_name,
      email: token.email,
      objectId: token.sub,
      accountEnabled: false,
      selectedRole: token.extension_selectedrole,
      accountStatus: token.extension_accountstatus,
      ifNoPendingRequest: token.extension_ifNoPendingRequest,
      emailAdmin: token.extension_emailAdmin,
    };

    const url = 'https://biogenbackendapi.azurewebsites.net/saveUser';
    return this.http.post(url, body);
  }
}
