import { BehaviorSubject, Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import {
  VideoTrialStoreActions,
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Store } from '@ngrx/store';
import { Procedure } from 'src/app/core/models/procedure.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @ViewChild('stepper', { static: true }) stepper!: MatStepper;
  videoId = 'test';
  showVideoPlayer = true;

  private _jumpLocation = new BehaviorSubject<number>(0);

  jumpLocation = this._jumpLocation.asObservable();
  isLoading = false;
  procedure: Observable<Procedure>;

  constructor(
    private router: Router,
    private store$: Store<VideoTrialStoreState.State>
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(VideoTrialStoreActions.getProcedure());
    this.store$.select(VideoTrialStoreSelectors.isLoading).subscribe((res) => {
      this.isLoading = res;
    });
    this.procedure = this.store$.select(VideoTrialStoreSelectors.getProcedure);
    this.store$.select(VideoTrialStoreSelectors.getCurrentVideo).subscribe(res => {
      this.videoId = res.video.videoId;
    });
  }

  redirectToHome(): void {
    this.router.navigate(['/videoList']);
  }

  goToNext(videoId: string): void {
    this.videoId = videoId;
    // this.stepper.next();
    this.showVideoPlayer = true;
  }

  resetPlayer(): void {
    this.showVideoPlayer = false;
  }

  annotationAdded(): void {
    this.redirectToHome();
  }

  skipVideoToTime(time: number): void {
    this._jumpLocation.next(time);
  }
}
