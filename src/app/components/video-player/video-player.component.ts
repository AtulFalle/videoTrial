import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from './../../service/shared.service';
import { TrialVideo, Annotation } from './../../core/models/annotations.model';
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

  url: string | ArrayBuffer | null = '';
  subtitle = '';
  videoStatus = false;
  time = '0';
  duration = '0';

  isDataLoaded = false;

  // tslint:disable-next-line: variable-name
  private _subscription = [new Subscription()];
  annotationMarkerList$!: Observable<TrialVideo>;
  annotationMarkerList: Annotation[] = [];

  set subscription(sub: Subscription) {
    this._subscription.push(sub);
  }

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private sharedService: SharedService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.store$
      .select(VideoTrialStoreSelectors.getCurrentVideo)
      .subscribe((res: TrialVideo) => {
        this.annotationMarkerList = [...res.annotations];
        this.url = res.video.data;
        this.subtitle = res.video.subtitle;
        this.isDataLoaded = true;
      });
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

  getTime(): string {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    return '' + player.duration;
  }

  getProgressValue(time: string): number {
    const percentage = (parseInt(time, 10) / parseInt(this.duration, 10)) * 100;
    return Math.floor(percentage);
  }
  getCurrentTime(ev: any): void {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    this.duration = '' + player.duration;
    this.time = '' + player.currentTime;
    const playerTime = {
      time: this.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if (player.paused) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;
    }
    this.sharedService.currentTimeObs$.next(playerTime);
  }

  videoLoaded(ev: any): void {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    this.duration = '' + player.duration;
    this.time = '' + player.currentTime;
    const playerTime = {
      time: this.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if (player.paused) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;
    }

    this.sharedService.currentTimeObs$.next(playerTime);
  }

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
  timelineDragged(ev: MatSliderChange): void {
    console.log(ev.value);
    const value = ev.value || 0;

    const percentage = value / 100;

    const currentTime = percentage * parseInt(this.duration, 10);

    console.log(currentTime);

    const player = this.videoPlayer.nativeElement;
    player.currentTime = currentTime;
  }
  calculateMargin(time: string): string {
    const value = this.getProgressValue(time);
    return '' + value + '%';
  }

  jumpToAnnotation(time: string): void {
    const player = this.videoPlayer.nativeElement;
    player.currentTime = time;
    this.time = '' + player.currentTime;
  }

  getSafeURL(): SafeResourceUrl {
    const url = 'http://localhost:3000/annotation.vtt';
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}
