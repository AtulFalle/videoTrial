import { Annotation } from './../../../core/models/annotations.model';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Video } from 'src/app/core/models/video.model';
import {
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';

@Component({
  selector: 'app-azure-media-player',
  templateUrl: './azure-media-player.component.html',
  styleUrls: ['./azure-media-player.component.scss'],
})
export class AzureMediaPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer', { static: true }) videoPlayer: ElementRef;
  myPlayer: amp.Player;
  videoStatus = false;
  matches: any[] = [];
  constructor(private store$: Store<VideoTrialStoreState.State>) {}
  ngAfterViewInit(): void {
    const myOptions = {
      autoplay: false,
      controls: true,
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
    this.myPlayer.ready(() => {
      console.log('player is loaded');

      console.log(this.myPlayer.duration());

      this.store$
        .select(VideoTrialStoreSelectors.getCurrentVideo)
        .subscribe((res: Video) => {
          // this.annotationMarkerList = [...res.annotations];
          // const annotation = [];
          // for (const iterator of res.annotations) {
          //   annotation.push(iterator.time);
          // }
          // this.myPlayer.options(this.getPlayerOptions(annotation));
          this.appendAnnotations(res.annotations);
        });
    });
  }

  ngOnInit(): void {
    // const myOptions = {
    //   autoplay: false,
    //   controls: true,
    //   height: '400',
    //   poster: '',
    //   fluid: true,
    //   plugins: {
    //     timelineMarker: {
    //       markertime: ['0:00', '1:30', '1:48'],
    //     },
    //   },
    // };
    // this.myPlayer = amp(this.videoPlayer.nativeElement, myOptions);
    // this.myPlayer.src([
    //   {
    //     src:
    //       'http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest',
    //     type: 'application/vnd.ms-sstr+xml',
    //   },
    // ]);
    // this.store$
    //   .select(VideoTrialStoreSelectors.getCurrentVideo)
    //   .subscribe((res: Video) => {
    //     // this.annotationMarkerList = [...res.annotations];
    //     const annotation = [];
    //     for (const iterator of res.annotations) {
    //       annotation.push(iterator.time);
    //     }
    //     this.myPlayer.options(this.getPlayerOptions(annotation));
    //   });
    // this.myPlayer.
  }

  getPlayerOptions(annotation: string[]): any {
    return {
      autoplay: false,
      controls: true,
      height: '400',
      poster: '',
      fluid: true,
      plugins: {
        timelineMarker: {
          markertime: annotation,
        },
      },
    };
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
  addAnnotation(): void {}

  // timeline.js
  getElementsByClassName(className: string, childClass: any): any {
    const elements = document

      .getElementById('azuremediaplayer')
      .getElementsByClassName(className);

    // const elements = (this.videoPlayer
    //   .nativeElement as HTMLElement).getElementsByClassName(className);
    if (!childClass) {
      return elements && elements.length > 0 ? elements[0] : null;
    }

    if (elements && elements.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        this.traverse(elements[i], childClass);
      }
    }
    return this.matches.length > 0 ? this.matches[0] : null;
  }
  traverse(node: any, childClass: any): any {
    if (node && node.childNodes) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].childNodes.length > 0) {
          this.traverse(node.childNodes[i], childClass);
        }

        if (
          node.childNodes[i].getAttribute &&
          node.childNodes[i].getAttribute('class')
        ) {
          if (
            node.childNodes[i]
              .getAttribute('class')
              .split(' ')
              .indexOf(childClass) >= 0
          ) {
            this.matches.push(node.childNodes[i]);
          }
        }
      }
    }
  }

  calculateMargin(time: string): string {
    const value = this.getProgressValue(time);
    return '' + value + '%';
  }
  getProgressValue(time: string): number {

    console.log(this.myPlayer.duration());

    try {
      const percentage = (parseInt(time, 10) / this.myPlayer.duration()) * 100;
      return Math.floor(percentage);
    } catch (e) {
      return 1;
    }
  }

  appendAnnotations(annotationList: Annotation[]): any {
    const playerSlider = this.getElementsByClassName(
      'vjs-progress-control',
      'vjs-slider'
    ) as HTMLElement;
    for (const iterator of annotationList) {
      const div = document.createElement('div');
      div.className = 'amp-timeline-marker';
      div.style.left = this.calculateMargin(iterator.videoPlayerTime);
      div.innerHTML = '&nbsp;&nbsp;';
      playerSlider.appendChild(div);
    }
  }

  // appendAnnotationtoVideoPlayer(progressControlSlider: any): any {
  //   if (progressControlSlider) {
  //     for (var index = 0; index < options.markertime.length; index++) {
  //       var marker = options.markertime[index];
  //       if (marker) {
  //         var secs = this.convertTimeFormatToSecs(marker);
  //         if (secs >= 0 && secs <= duration) {
  //           var markerLeftPosition = (secs / duration) * 100;
  //           var div = document.createElement('div');
  //           div.className = 'amp-timeline-marker';
  //           div.style.left = markerLeftPosition + '%';
  //           div.innerHTML = '&nbsp;&nbsp;';
  //           progressControlSlider.appendChild(div);
  //         }
  //       }
  //     }
  //   }
  // }

  convertTimeFormatToSecs(timeFormat: string): any {
    if (timeFormat) {
      const timeFragments = timeFormat.split(':');
      if (timeFragments.length > 0) {
        switch (timeFragments.length) {
          case 4:
            return (
              parseInt(timeFragments[0], 10) * 60 * 60 +
              parseInt(timeFragments[1], 10) * 60 +
              parseInt(timeFragments[2], 10) +
              parseInt(timeFragments[3], 10) / 100
            );
          case 3:
            return (
              parseInt(timeFragments[0], 10) * 60 * 60 +
              parseInt(timeFragments[1], 10) * 60 +
              parseInt(timeFragments[2], 10)
            );
          case 2:
            return (
              parseInt(timeFragments[0], 10) * 60 +
              parseInt(timeFragments[1], 10)
            );
          case 1:
            return parseInt(timeFragments[0], 10);
          default:
            return parseInt(timeFragments[0], 10);
        }
      } else {
        return parseInt(timeFormat, 10);
      }
    }

    return 0;
  }
}
