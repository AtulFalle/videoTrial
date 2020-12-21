import { SharedService } from './../../service/shared.service';
import { TrialVideo } from './../../core/models/annotations.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss'],
})
export class VideoUploaderComponent implements OnInit {
  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef;
  url!: string | ArrayBuffer | null;

  @Output()
  videoUploaded: EventEmitter<string> = new EventEmitter(true);

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}

  onSelectFile(event: any): void {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const that = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (ev) => {
        this.url = (ev.target as FileReader).result;

        const random = 'videoId-' + Math.random() * 100;

        const videoObject: TrialVideo = {
          video: {
            videoId: random,
            data: this.url,
          },
          annotations: [],
          metadata: {
            currentTime: '0',
            duration: '0',
          },
        };
        this.store$.dispatch(
          VideoTrialStoreActions.uploadVideo({ video: videoObject })
        );
        // this.sharedService.currentVideoID = (ev.target as FileReader).result;
        that.videoUploaded.emit(random);
        // this.router.navigate(['/videoList']);
      };
    }
  }
}
