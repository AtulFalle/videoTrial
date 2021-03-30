import { SharedService } from './shared.service';
import { FileMetadata } from './../core/models/file-upload.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { VideoTrialStoreState } from '../root-store/video-trial-store';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private store$: Store<VideoTrialStoreState.State>, private sharedService: SharedService) {}

  startUploading(file: FileMetadata): void {

    const startChunk = 0;

    file.file.splice()
    for (const iterator of object) {

    }
  }

  uploadChunk(file:FileMetadata): void {

    this.sharedService.appendChunk(file);

  }
}
