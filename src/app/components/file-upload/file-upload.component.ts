import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  CHUNK_SIZE = 300000;
  progress = 0;
  isPaused = false;
  lastChunkSend = 0;
  files: any[] = [];
  bockIdList: string[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  async fileUpload(e: any, val: any): Promise<any> {
    console.log(e);

    console.log(e.target.files);
    this.files = e.target.files;
    console.log(this.files);

    await this.uploadFiles(0);
  }

  private async uploadFiles(offsetValue: number) {
    const file = this.files[0];
    for (
      let offset = offsetValue;
      offset < file.size;
      offset += this.CHUNK_SIZE
    ) {
      const chunk = file.slice(offset, offset + this.CHUNK_SIZE);
      if (this.isPaused) {
        console.log('upload paused');
        return;
      }
      // if (offset === 0) {
      // const a = await this.sendFirstRequest(chunk, file, offset);
      // console.log(a);

      // this.lastChunkSend = offset;
      // console.log(this.lastChunkSend);

      // this.progress = Math.round((offset / file.size) * 100);
      // } else {
      // await this.sendFileChunks(chunk, file, offset);
      // console.log(this.lastChunkSend);

      const a = await this.sendFirstRequest(chunk, file, offset);
      console.log(a);
      this.lastChunkSend = offset;

      this.bockIdList.push(a.blockId);

      this.progress = Math.round((offset / file.size) * 100);
      // }
    }

    console.log(this.bockIdList);
    this.progress = 100;
    console.log('file upload complete');
  }

  sendFirstRequest(data: any, file: any, offset: any): Promise<any> {
    return this.sendPUTReq(data, file, offset);
  }
  sendPUTReq(data: any, file: any, offset: any): Promise<any> {
    const body = {
      FileName: 'a',
      FileId: 'a',
      StartChunk: 'a',
      EndChunk: 'a',
      FileSize: 'a',
    };
    const formData: FormData = new FormData();

    // const blobData = new Blob([gzip(JSON.stringify(data))];
    formData.append('files', data);
    // formData.append('FileName',  'test');
    // formData.append('FileId',  'test');
    // formData.append('StartChunk',  '' + offset);
    // formData.append('EndChunk',  'test');
    // formData.append('FileSize',  'test');
    // const HttpUploadOptions = {
    //   headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
    // };
    return this.http
      .put(
        'https://localhost:44366/api/Values/UploadFiles/' + 'testFile.jpeg',
        formData
      )
      .toPromise();
  }

  commitFiles(): Promise<any> {
    return this.http
      .put(
        'https://localhost:44366/api/Values/UploadFiles/' + 'testFile.jpeg',
        this.bockIdList
      )
      .toPromise();
  }

  sendFileChunks(data: any, file: any, offset: any): Promise<any> {
    console.log('sending PUT requset for data', data);
    return of('sending PUT requset for data' + data)
      .pipe(delay(1000))
      .toPromise();
  }

  pauseUpload(): void {
    this.isPaused = true;
  }

  resumeUpload(): void {
    this.isPaused = false;
    this.uploadFiles(this.lastChunkSend + this.CHUNK_SIZE);
  }
}
