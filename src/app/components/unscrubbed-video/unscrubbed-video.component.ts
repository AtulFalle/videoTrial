import { Video } from './../../core/models/video.model';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { VideoTrialStoreSelectors, VideoTrialStoreState } from 'src/app/root-store/video-trial-store';

@Component({
  selector: 'app-unscrubbed-video',
  templateUrl: './unscrubbed-video.component.html',
  styleUrls: ['./unscrubbed-video.component.scss'],
})
export class UnscrubbedVideoComponent implements OnInit {
  videoSub$!: Observable<Video>;

  videoObject: Video = {
    videoId: 'test',
    name: 'src/assets/video/big_buck_bunny_720p_10mb.mp4',
    subtitles: 'test',
    formats: [],
    annotations: [],
    type: 'Unscrubbed',
  };
  constructor(
    private store$: Store<VideoTrialStoreState.State>,

  ) {}

  ngOnInit(): void {
    this.videoSub$ = this.store$.select(
      VideoTrialStoreSelectors.getCurrentVideo
    );
  }
}
