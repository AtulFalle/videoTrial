import { FileUploadStatus } from './../core/enum/file-upload-status.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { SharedService } from './shared.service';
import {
  FileMetadata,
  BlobUploadResponse,
} from './../core/models/file-upload.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
} from '../root-store/video-trial-store';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private http: HttpClient
  ) {}

  async startUploading(file: FileMetadata) {
    const startChunk = 0;
    const offsetValue = 0;

    const blockList = [];

    for (
      let offset = offsetValue;
      offset < file.size;
      offset += environment.CHUNK_SIZE
    ) {
      const chunk = file.file.slice(offset, offset + environment.CHUNK_SIZE);
      const id = await this.uploadChunk(chunk, file);
      blockList.push(id.blockId);
      const updatedFile = { ...file };
      const progress = ((offset / file.size) * 100).toFixed(2);
      updatedFile.progress = +progress;
      this.store$.dispatch(
        VideoTrialStoreActions.updateFileProgress({file: updatedFile})
      );
    }
    const a = await this.commitFile(blockList, file);
    const updatedFile = { ...file };
    updatedFile.progress = 100.0;
    updatedFile.status = FileUploadStatus.UPLOADED;
    this.store$.dispatch(
      VideoTrialStoreActions.updateFileProgress({file: updatedFile})
      );
    console.log(a);
  }

  uploadChunk(chunk: any, file: FileMetadata): Promise<BlobUploadResponse> {
    return this.appendChunk(chunk, file).toPromise();
  }

  commitFile(blockList: string[], file: FileMetadata): Promise<any> {
    return this.commitChunk(blockList, file).toPromise();
  }

  appendChunk(chunk: any, file: FileMetadata): Observable<BlobUploadResponse> {
    const url =
      'https://localhost:44366/api/Values/UploadFiles/' + file.fileName;
    const formData = new FormData();
    formData.append('files', chunk);
    return this.http.put<BlobUploadResponse>(url, formData).pipe(retry(3));
  }

  commitChunk(fileIdList: string[], file: any): Observable<any> {
    const url =
      'https://localhost:44366/api/Values/commitFile/' + file.fileName;
    const body = {
      idList: fileIdList,
    };
    return this.http.post(url, body);
  }
}
