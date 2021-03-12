import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  CHUNK_SIZE = 10000;
  progress = 0;
  isPaused = false;
  lastChunkSend = 0;
  files: any[] = [];
  constructor() {}

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
        ('upload paused');
        return;
      }
      if (offset === 0) {
        await this.sendFirstRequest(chunk);
        this.lastChunkSend = offset;
        console.log(this.lastChunkSend);

        this.progress = Math.round((offset / file.size) * 100);
      } else {
        this.lastChunkSend = offset;
        await this.sendFileChunks(chunk);
        console.log(this.lastChunkSend);

        this.progress = Math.round((offset / file.size) * 100);
      }
    }
    
    this.progress = 100;
    console.log('file upload complete');
  }

  sendFirstRequest(data: any): Promise<any> {
    console.log('sending post requset for data', data);
    return of('sending post requset for data' + data)
      .pipe(delay(1000))
      .toPromise();
  }

  sendFileChunks(data: any): Promise<any> {
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
