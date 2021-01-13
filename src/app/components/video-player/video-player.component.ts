import { environment } from './../../../environments/environment';
import { Video } from './../../core/models/video.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from './../../service/shared.service';
import { TrialVideo, Annotation } from './../../core/models/annotations.model';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
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
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @Input()
  videoId!: string;

  @Input()
  procedureId!: string;

  @Input()
  jumpToLocation!: Observable<number>;

  @ViewChild('videoPlayer', { static: true })
  videoPlayer: ElementRef;

  @Output()
  addAnnotationDesc: EventEmitter<boolean> = new EventEmitter(true);

  url = '';
  subtitle = '';
  videoStatus = false;
  time = '0';
  duration = '0';

  isDataLoaded = false;

  // tslint:disable-next-line: variable-name
  private _subscription = [new Subscription()];
  annotationMarkerList$!: Observable<TrialVideo>;
  annotationMarkerList: Annotation[] = [];
  isRefreshing = false;
  isSubtitle = { show: false, comment: '' };
  myPlayer: amp.Player;

  set subscription(sub: Subscription) {
    this._subscription.push(sub);
  }

  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private sharedService: SharedService,
    private domSanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {
    const myOptions = {
      autoplay: false,
      controls: false,
      height: '400',
      poster: '',
      fluid: true,
    };
    this.myPlayer = amp(this.videoPlayer.nativeElement, myOptions);
    this.myPlayer.src([
      {
        src:
          'http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest',
        type: 'application/vnd.ms-sstr+xml',
      },
    ]);

    this.myPlayer.addEventListener(amp.eventName.timeupdate, () => {
      this.updateCurrentTime();
    });
    this.myPlayer.addEventListener(amp.eventName.durationchange, () => {
      this.updateCurrentTime();
    });
  }

  ngOnInit(): void {
    this.store$
      .select(VideoTrialStoreSelectors.getCurrentVideo)
      .subscribe((res: Video) => {
        this.annotationMarkerList = [...res.annotations];
        this.url = environment.SERVER_URI + '/videos/' + res.name;
        this.subtitle =
          environment.SERVER_URI + '/annotations/' + res.subtitles;
        this.isDataLoaded = true;
      });
    this.subscription = this.sharedService.jumpToAnnotationTime.subscribe(
      (res) => {
        if (res) {
          this.pause();
          const player = this.videoPlayer.nativeElement as HTMLVideoElement;
          player.load();
          this.videoStatus = false;
          player.currentTime = parseFloat(res);
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
    this.myPlayer.play();
    // this.myPlayer.options
    // this.time = '' + player.currentTime;
    // this.sharedService.pauseVideoObs$.next(false);
  }

  pause(): void {
    const player = this.videoPlayer.nativeElement;
    this.videoStatus = false;
    // this.time = '' + player.currentTime;
    this.myPlayer.pause();
  }

  forward(value: number): void {
    const player = this.videoPlayer.nativeElement;
    const currentTime = this.myPlayer.currentMediaTime() + value;
    this.myPlayer.currentTime(currentTime);
    // this.time = player.currentTime;
    this.myPlayer.play();
  }

  backward(value: number): void {
    const player = this.videoPlayer.nativeElement;
    const currentTime = this.myPlayer.currentMediaTime() - value;
    this.myPlayer.currentTime(currentTime);
    // this.time = '' + player.currentTime;
    this.myPlayer.play();
  }

  // play(): void {
  //   const player = this.videoPlayer.nativeElement;
  //   this.videoStatus = true;
  //   player.play();
  //   this.time = '' + player.currentTime;
  //   this.sharedService.pauseVideoObs$.next(false);
  // }

  // pause(): void {
  //   const player = this.videoPlayer.nativeElement;
  //   this.videoStatus = false;
  //   this.time = '' + player.currentTime;
  //   player.pause();
  // }

  // forward(value: number): void {
  //   const player = this.videoPlayer.nativeElement;
  //   player.currentTime += value;
  //   this.time = player.currentTime;
  //   player.play();
  // }

  // backward(value: number): void {
  //   const player = this.videoPlayer.nativeElement;
  //   player.currentTime -= value;
  //   this.time = '' + player.currentTime;
  //   player.play();
  // }

  getTime(): string {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    return '' + player.duration;
  }

  updateCurrentTime(): void {
    this.duration = this.myPlayer.duration().toString();
    this.time = this.myPlayer.currentMediaTime().toString();
  }
  getCurrentTime(ev: any): void {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    this.duration = '' + player.duration;
    this.time = '' + player.currentTime;
    const playerTime = {
      time: this.sharedService.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if (player.paused) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;
    }

    this.isSubtitle = this.showSubtitle(this.time, this.annotationMarkerList);
    console.log(this.isSubtitle);

    this.sharedService.currentTimeObs$.next(playerTime);
  }
  showSubtitle(
    time: any,
    annotationMarkerList: Annotation[]
  ): { show: boolean; comment: string } {
    console.log(time, annotationMarkerList);

    let res = false;
    let subtitleString = '';
    const currenttime = parseInt(time, 10);
    const endTime = currenttime + environment.SUBTITLE_TIME;

    for (const iterator of annotationMarkerList) {
      if (
        currenttime >= parseInt(iterator.videoPlayerTime, 10) &&
        currenttime <= parseInt(iterator.videoPlayerTime, 10) + 3
      ) {
        res = true;
        subtitleString = iterator.comments;
      }
    }

    return {
      show: res,
      comment: subtitleString,
    };
  }

  videoLoaded(ev: any): void {
    const player = this.videoPlayer.nativeElement as HTMLVideoElement;
    this.duration = '' + player.duration;
    this.time = '' + player.currentTime;
    const playerTime = {
      time: this.sharedService.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if (player.paused) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;
    }

    this.sharedService.currentTimeObs$.next(playerTime);
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
  getProgressValue(time: string): number {
    const percentage = (parseInt(time, 10) / parseInt(this.duration, 10)) * 100;
    return Math.floor(percentage);
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

  getFotmattedTime(time: string): string {
    return this.sharedService.toTimeFormat(time);
  }

  /**
   * refresh video player, to reflect updated subtitle file
   */
  refreshAnnotation(): void {
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false;
    }, 100);
  }

  /**
   * add custom annotations
   */
  addCustomSubtitles(): void {}
}
