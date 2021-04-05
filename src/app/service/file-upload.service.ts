import { VideoTrialStoreActions, VideoTrialStoreSelectors, VideoTrialStoreState } from 'src/app/root-store/video-trial-store';
import { FileUploadStatus } from './../core/enum/file-upload-status.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import {
  FileMetadata,
  BlobUploadResponse,
  ChunkDetails,
} from './../core/models/file-upload.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private http: HttpClient
  ) {}

  async startUploading(file: FileMetadata): Promise<any> {
    const startChunk = 0;
    const offsetValue = 0;

    const blockList: string[] = [];

    return this.uploadChunks(offsetValue, file, blockList);
  }

  private async uploadChunks(
    offsetValue: number,
    file: FileMetadata,
    blockList: any[]
  ): Promise<any> {
    for (
      let offset = offsetValue;
      offset < file.size;
      offset += environment.CHUNK_SIZE
    ) {
      const tempFile = await this.getFileFromStore(file);

      if (tempFile.status === FileUploadStatus.PAUSED) {
        return;
      }
      const chunk = file.file.slice(offset, offset + environment.CHUNK_SIZE);
      const id = await this.uploadChunk(chunk, file);

      if (!id) {
        const pause = await this.pauseUpload(file);
        return;
      }
      blockList.push(id.blockId);
      const updatedFile = { ...file };
      const progress = ((offset / file.size) * 100).toFixed(2);
      updatedFile.progress = +progress;
      updatedFile.status = tempFile.status;
      updatedFile.lastChunk = offset + environment.CHUNK_SIZE;
      updatedFile.chunkDetails = blockList.map((ele) => {
        const temp: ChunkDetails = {
          blockId: ele,
          chunkEnd: offset + environment.CHUNK_SIZE,
        };
        return temp;
      });
      this.store$.dispatch(
        VideoTrialStoreActions.updateFileProgress({ file: updatedFile })
      );
    }
    const a = await this.commitFile(blockList, file);
    const updatedFile = { ...file };
    updatedFile.progress = 100.0;
    updatedFile.lastChunk = file.size;
    updatedFile.status = FileUploadStatus.UPLOADED;
    this.store$.dispatch(
      VideoTrialStoreActions.updateFileProgress({ file: updatedFile })
    );
    return a;
  }

  private async getFileFromStore(file: FileMetadata) {
    const tempFile = await this.store$
      .select(VideoTrialStoreSelectors.getUploadingFileByName, {
        fileName: file.fileName,
      })
      .pipe(take(1))
      .toPromise();
    console.log(tempFile);
    return tempFile;
  }

  uploadChunk(chunk: any, file: FileMetadata): Promise<BlobUploadResponse> {
    return this.appendChunk(chunk, file).toPromise().catch(e => null);
  }

  commitFile(blockList: string[], file: FileMetadata): Promise<any> {
    return this.commitChunk(blockList, file).toPromise();
  }

  appendChunk(chunk: any, file: FileMetadata): Observable<BlobUploadResponse> {
    const url =
      'https://localhost:44366/api/Values/UploadFiles/' + file.fileName;
    const formData = new FormData();
    formData.append('files', chunk);
    return this.http.put<BlobUploadResponse>(url, formData).pipe(
      catchError((e: any) => {
        console.log('Tried ' + url + ' Got ' + e);
        return throwError(null);
      }),
      retry(3)
    );
  }

  commitChunk(fileIdList: string[], file: any): Observable<any> {
    const url =
      'https://localhost:44366/api/Values/commitFile/' + file.fileName;
    const body = {
      idList: fileIdList,
    };
    return this.http.post(url, body);
  }

  async resumeUpload(file: FileMetadata): Promise<any> {
    const tempFile = { ...(await this.getFileFromStore(file)) };
    tempFile.status = FileUploadStatus.IN_PROGRESS;
    this.store$.dispatch(
      VideoTrialStoreActions.updateFileStatus({ file: tempFile })
    );
    const blockList = tempFile.chunkDetails.map((ele) => ele.blockId);
    const offset = tempFile.lastChunk;

    const res = await this.uploadChunks(offset, tempFile, blockList);
    return res;
  }

  async pauseUpload(file: FileMetadata): Promise<any> {
    console.log('uploading file');

    const tempFile = { ...(await this.getFileFromStore(file)) };
    tempFile.status = FileUploadStatus.PAUSED;
    this.store$.dispatch(
      VideoTrialStoreActions.updateFileStatus({ file: tempFile })
    );
  }
}
