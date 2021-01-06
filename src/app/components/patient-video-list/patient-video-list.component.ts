import { environment } from './../../../environments/environment';
import { Video } from './../../core/models/video.model';
import { TrialVideo } from './../../core/models/annotations.model';
import { Component, Input, OnInit } from '@angular/core';
import { Procedure } from 'src/app/core/models/procedure.model';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-patient-video-list',
  templateUrl: './patient-video-list.component.html',
  styleUrls: ['./patient-video-list.component.scss'],
})
export class PatientVideoListComponent implements OnInit {
  @Input()
  procedure: Procedure;

  showVideoList = false;
  constructor(private store$: Store<VideoTrialStoreState.State>) {}

  ngOnInit(): void {}

  toggleVideoList(): void {
    this.showVideoList = !this.showVideoList;
  }

  changeCurrentVideo(video: Video): void {
    this.store$.dispatch(VideoTrialStoreActions.setCurrentVideo({ video }));
  }

  downloadVideo(video: Video): void {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'http://localhost:3000/procedure/downloadVideo/' + video.name);
    link.setAttribute('download', 'video.mp4');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getVideoUrl(name: string): string {

    return environment.SERVER_URI + '/videos/' + name;
  }
}
