import { Store } from '@ngrx/store';
import { environment } from './../../../environments/environment';
import { Video } from './../../core/models/video.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from './../../service/shared.service';
import { TrialVideo, Annotation } from './../../core/models/annotations.model';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
declare var amp: any;
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @Input()
  videoId: string;

  @Input()
  video!: Observable<Video>;

  @Input()
  procedureId: string;

  @Input()
  jumpToLocation!: Observable<number>;

  @ViewChild('videoPlayer', { static: true })
  videoPlayer: ElementRef;

  @ViewChild('videoParent', { static: true })
  videoParent: ElementRef;

  @Output()
  addAnnotationDesc: EventEmitter<boolean> = new EventEmitter(true);

  url = '';
  subtitle = '';
  videoStatus = false;
  time = '0';
  duration = '0';
  isDataLoaded = false;
  selectedResolution = '-1';
  videoResolution: { resolution: number; bitrate: number }[] = [];
  showSubtitles = true;
  DUMMY_URL =
    'http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest';

  // tslint:disable-next-line: variable-name
  private _subscription = [new Subscription()];
  annotationMarkerList$!: Observable<TrialVideo>;
  annotationMarkerList: Annotation[] = [];
  isRefreshing = false;
  isSubtitle = { show: false, comment: '', time: '', videoPlayerTime: '' };
  myPlayer: amp.Player;
  tracks: any;
  currentVolume = 100;
  showAnnoFlag: boolean;
  currentBitrate: string;
  comments = '';
  isFullScreen: boolean = false;
  updateComment = 'test';
  showEditComment: boolean;

  set subscription(sub: Subscription) {
    this._subscription.push(sub);
  }

  constructor(
    private sharedService: SharedService,
    private domSanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private store$: Store<VideoTrialStoreState.State>
  ) {}

  ngAfterViewInit(): void {
    this.loadVideoPlayer(this.DUMMY_URL);
  }

  private loadVideoPlayer(url: string): void {
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
        src: this.DUMMY_URL,
        type: 'application/vnd.ms-sstr+xml',
      },
    ]);

    this.myPlayer.addEventListener(amp.eventName.timeupdate, (e: any) => {
      this.getCurrentTime(e);
    });
    this.myPlayer.addEventListener(amp.eventName.durationchange, (e: any) => {
      this.getCurrentTime(e);
    });
    this.myPlayer.addEventListener(amp.eventName.loadedmetadata, () => {
      this.getTracks();
    });

    this.myPlayer.addEventListener(amp.eventName.playbackbitratechanged, () => {
      console.log(
        'update resolution- playback bitrate chaanged' +
          this.myPlayer.currentPlaybackBitrate()
      );
      this.currentBitrate = this.getBitrate(
        '' + this.myPlayer.currentPlaybackBitrate()
      );
      const streamList = this.myPlayer.currentVideoStreamList();
      console.log(streamList);
      this.cdRef.detectChanges();
      // alert('changing quality-playback'  + this.myPlayer.currentPlaybackBitrate());
    });
  }

  getTracks(): void {
    const streamList = this.myPlayer.currentVideoStreamList();
    console.log(streamList);

    if (streamList) {
      for (const item of streamList.streams[0].tracks) {
        const temp = { resolution: item.height, bitrate: item.bitrate };
        this.videoResolution.unshift(temp);
      }
    }
  }

  ngOnInit(): void {
    this.subscription = this.video.subscribe((res: Video) => {
      this.annotationMarkerList = [...res.annotations];
      this.url = environment.SERVER_URI + '/videos/' + res.name;
      this.subtitle = environment.SERVER_URI + '/annotations/' + res.subtitles;
      this.isDataLoaded = true;
      this.isSubtitle = null;
      this.isSubtitle = this.showSubtitle(this.time, this.annotationMarkerList);
    });
    this.subscription = this.sharedService.jumpToAnnotationTime.subscribe(
      (res) => {
        if (res) {
          this.pause();
          const player = this.videoPlayer.nativeElement as HTMLVideoElement;
          this.videoStatus = false;
          this.myPlayer.currentTime(parseFloat(res));
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
    this.videoStatus = true;
    this.myPlayer.play();
    this.sharedService.pauseVideoObs$.next(false);
  }

  pause(): void {
    this.videoStatus = false;
    this.myPlayer.pause();
    // this.sharedService.pauseVideoObs$.next(true);
  }

  forward(value: number): void {
    const currentTime = this.myPlayer.currentMediaTime() + value;
    this.myPlayer.currentTime(currentTime);
    this.myPlayer.play();
  }

  backward(value: number): void {
    const currentTime = this.myPlayer.currentMediaTime() - value;
    this.myPlayer.currentTime(currentTime);
    this.myPlayer.play();
  }

  getTime(): string {
    return this.myPlayer.duration().toString();
  }

  updateCurrentTime(): void {
    this.duration = this.myPlayer.duration().toString();
    this.time = this.myPlayer.currentMediaTime().toString();
  }

  getCurrentTime(ev: any): void {
    this.duration = this.myPlayer.duration().toString();
    this.time = this.myPlayer.currentMediaTime().toString();
    const playerTime = {
      time: this.sharedService.toTimeFormat(this.time),
      videoPlayerTime: this.time,
    };
    if (this.myPlayer.paused()) {
      this.videoStatus = false;
    } else {
      this.videoStatus = true;
    }

    this.isSubtitle = this.showSubtitle(this.time, this.annotationMarkerList);
    this.cdRef.detectChanges();
    console.log(this.isSubtitle.comment);

    this.sharedService.currentTimeObs$.next(playerTime);
  }

  showSubtitle(
    time: any,
    annotationMarkerList: Annotation[]
  ): { show: boolean; comment: string; time: string; videoPlayerTime: string } {
    let res = false;
    let subtitleString = '';
    let markerTime = '00:00';
    let videoPlayerTime = '0';
    const currenttime = parseInt(time, 10);

    console.log(annotationMarkerList);

    for (const iterator of annotationMarkerList) {
      if (
        currenttime >= parseInt(iterator.videoPlayerTime, 10) &&
        currenttime <= parseInt(iterator.videoPlayerTime, 10) + 3
      ) {
        res = true;
        subtitleString = iterator.comments;
        markerTime = iterator.time;
        videoPlayerTime = iterator.videoPlayerTime;
      }
    }
    const temp = {
      show: res,
      comment: subtitleString,
      time: markerTime,
      videoPlayerTime,
    };
    console.log(temp);

    return temp;
  }

  timelineDragged(ev: MatSliderChange): void {
    const value = ev.value || 0;
    const percentage = value / 100;
    const currentTime = percentage * parseInt(this.duration, 10);
    const player = this.videoPlayer.nativeElement;
    player.currentTime = currentTime;
    this.myPlayer.currentTime(currentTime);
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
    this.time = '' + this.myPlayer.currentTime();
    this.myPlayer.currentTime(+time);
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

  updateResolution(e: any): void {
    const val = e.value;
    const streamList = this.myPlayer.currentVideoStreamList();

    if (val === '-1') {
      streamList.streams[0].selectTrackByIndex(-1);
      return;
    }
    const index =
      this.videoResolution.length - this.videoResolution.indexOf(val);
    streamList.streams[0].selectTrackByIndex(index - 1);
  }

  getBitrate(val: string): string {
    switch (val.length) {
      case 6:
        return (+val / 1024).toFixed(2) + 'Kbps';
      case 7:
        return (+val / (1024 * 1024)).toFixed(2) + 'Mbps';
      default:
        return val;
    }
  }

  toggleSubtitles(val: boolean): void {
    this.showSubtitles = val;
  }

  volumeUpdated(e: any): void {
    const volume = +(e.value / 100).toFixed(1);
    this.myPlayer.volume(volume);
  }

  toggleMuteStatus(mutePlayer: boolean): void {
    if (mutePlayer) {
      this.currentVolume = 0;
      this.myPlayer.volume(0);
    } else {
      this.currentVolume = 50;
      this.myPlayer.volume(0.5);
    }
  }

  toggleFullscreen(isFullScreen: boolean): void {
    if (!isFullScreen) {
      this.isFullScreen = !isFullScreen;
      (this.videoParent.nativeElement as HTMLElement).requestFullscreen();
    } else {
      this.isFullScreen = !isFullScreen;
      document.exitFullscreen();
    }
  }

  checkKeyUp(ev: any): void {
    console.log(ev);
  }

  addAnnotation(): void {
    this.comments = '';
    this.myPlayer.pause();
    this.showAnnoFlag = true;
  }

  saveAnnotation(): void {
    const endtime =
      parseInt(this.sharedService.currentTimeObs$.value.videoPlayerTime, 10) +
      environment.SUBTITLE_TIME;

    const userResponse: Annotation = {
      id: 'annotationId-' + Math.random(),
      time: this.getFotmattedTime(this.time),
      comments: this.comments,
      videoPlayerTime: this.sharedService.currentTimeObs$.value.videoPlayerTime,
      endtime: this.sharedService.toTimeFormat(endtime.toString()),
    };

    this.store$.dispatch(
      VideoTrialStoreActions.addAnnotations({
        annotationsList: [userResponse],
        videoId: this.videoId,
        procedureId: this.procedureId,
      })
    );
    // this.store$.dispatch(
    //   VideoTrialStoreActions.getProcedure({ procedureID: this.procedureId })
    // );
    // reset form value
    this.comments = '';
  }

  updateAnnotation(videoPlayerTime: string, time: string): void {
    const endtime = parseInt(videoPlayerTime, 10) + environment.SUBTITLE_TIME;

    const userResponse: Annotation = {
      id: 'annotationId-' + Math.random(),
      time,
      comments: this.updateComment,
      videoPlayerTime,
      endtime: this.sharedService.toTimeFormat(endtime.toString()),
    };

    this.store$.dispatch(
      VideoTrialStoreActions.editAnnotation({
        annotation: userResponse,
        videoId: this.videoId,
      })
    );
    // this.store$.dispatch(
    //   VideoTrialStoreActions.getProcedure({ procedureID: this.procedureId })
    // );
    // reset form value
    this.updateComment = '';
    this.cdRef.detectChanges();
  }

  editComment(val: string): void {
    this.pause();
    this.showEditComment = true;
    this.updateComment = val;
  }
}
