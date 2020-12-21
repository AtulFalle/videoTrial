import { SharedService } from './../../service/shared.service';
import { TrialVideo } from './../../core/models/annotations.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import {
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Observable, Subscription } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input()
  videoId!: string;
  @Input()
  jumpToLocation!: Observable<number>;

  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef;

  @Output()
  addAnnotationDesc: EventEmitter<boolean> = new EventEmitter(true);

  url!: string | ArrayBuffer | null;
  videoStatus = false;
  time = '0';
  duration = '0';

  private _subscription = [new Subscription()];

  set subscription(sub: Subscription) {
    this._subscription.push(sub);
  }

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.subscription = this.sharedService.jumpToAnnotationTime.subscribe(
      (res) => {
        if (res) {
          this.pause();
          const player = this.videoPlayer.nativeElement;
          this.videoStatus = false;
          player.currentTime = res;
          this.time = '' + player.currentTime;
        }
      }
    );
    this.subscription = this.sharedService.videoStatus.subscribe((res) => {
      if (res) {
        this.pause();
      }
    });
    this.subscription = this.store$
      .select(VideoTrialStoreSelectors.getVideoList)
      .pipe(take(1))
      .subscribe((video: TrialVideo[]) => {
        console.log(video, this.videoId);

        for (const iterator of video) {
          if (this.videoId === iterator.video.videoId) {
            this.url = iterator.video.data;
          }
        }
      });
  }

  play(): void {
    const player = this.videoPlayer.nativeElement;
    this.videoStatus = true;
    player.play();
    this.time = '' + player.currentTime;
    this.sharedService.pauseVideoObs$.next(false);
  }

  pause(): void {
    const player = this.videoPlayer.nativeElement;
    this.videoStatus = false;
    this.time = '' + player.currentTime;
    player.pause();
  }

  forward(value: number): void {
    const player = this.videoPlayer.nativeElement;
    player.currentTime += value;
    this.time = player.currentTime;
    player.play();
  }

  backward(value: number): void {
    const player = this.videoPlayer.nativeElement;
    player.currentTime -= value;
    this.time = '' + player.currentTime;
    player.play();
  }

  resetPlayer(): void {}

  addAnnotation(): void {

    this.addAnnotationDesc.emit(true);

  }

  getTime(): string {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    return '' + player.duration;
  }

  getProgressValue(time: string): number {
    const percentage = (parseInt(time, 10) / parseInt(this.duration)) * 100;
    return Math.floor(percentage);
  }
  getCurrentTime(ev: any) {

    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    this.duration = '' + player.duration;
    this.time = '' + player.currentTime;
    const playerTime = {
      time: this.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if(player.paused) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;

    }
    this.sharedService.currentTimeObs$.next(playerTime);
  }


  videoLoaded(ev: any) {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    this.duration = '' + player.duration;
    this.time = '' + player.currentTime;
    const playerTime = {
      time: this.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if(player.paused) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;

    }

    this.sharedService.currentTimeObs$.next(playerTime);
  }

  toTimeFormat(secs: string): string {
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
  timelineDragged(ev: MatSliderChange): void {
    console.log(ev.value);
    const value = ev.value || 0;

    const percentage = value / 100;

    const currentTime = percentage * parseInt(this.duration);

    console.log(currentTime);

    const player = this.videoPlayer.nativeElement;
    player.currentTime = currentTime;
  }
}
