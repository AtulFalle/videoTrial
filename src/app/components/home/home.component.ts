import { Video } from './../../core/models/video.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  VideoTrialStoreActions,
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Store } from '@ngrx/store';
import { Procedure } from 'src/app/core/models/procedure.model';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { VideoTrialActionType } from 'src/app/root-store/video-trial-store/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @ViewChild('stepper', { static: true }) stepper!: MatStepper;

  @ViewChild('videoTab', { static: true }) videoTabIndex!: MatTabGroup;
  videoId = 'test';
  showVideoPlayer = true;

  private _jumpLocation = new BehaviorSubject<number>(0);

  jumpLocation = this._jumpLocation.asObservable();
  isLoading = false;
  procedure!: Observable<Procedure>;
  procedureID!: string;
  showActivityTab = true;
  videoSub$: Observable<Video>;

  constructor(
    private router: Router,
    private store$: Store<VideoTrialStoreState.State>,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.procedureID = this.actRoute.snapshot.params.id;
    this.store$.dispatch(
      VideoTrialStoreActions.getProcedure({ procedureID: this.procedureID })
    );
    this.store$.select(VideoTrialStoreSelectors.isLoading).subscribe((res) => {
      this.isLoading = res;
    });
    this.procedure = this.store$.select(VideoTrialStoreSelectors.getProcedure);
    this.videoSub$ = this.store$.select(
      VideoTrialStoreSelectors.getCurrentVideo
    );


    this.store$
      .select(VideoTrialStoreSelectors.getCurrentVideoTab)
      .subscribe((index) => {
        if (index === 1) {
          this.showActivityTab = false;
        } else {
          this.showActivityTab = true;
        }
      });
  }

  redirectToHome(): void {
    this.router.navigate(['/videoList']);
  }

  changeTab(index: number): void {
    this.videoTabIndex.selectedIndex = index;

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

  tabChanged(ev: MatTabChangeEvent): void {
    console.log(ev.index);
    this.store$.dispatch(
      VideoTrialStoreActions.updateCurrentVideoTab({ tab: ev.index })
    );
  }
}
