import { environment } from './../../../environments/environment.prod';
import { Annotation, TrialVideo } from './../../core/models/annotations.model';
import { SharedService } from './../../service/shared.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Store } from '@ngrx/store';
import {
  VideoTrialStoreActions,
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.scss'],
})
export class AnnotationListComponent implements OnInit {
  @ViewChild('comment', { static: true }) commentBox!: ElementRef;

  @Input()
  videoId!: string;

  @Input()
  procedureId!: string;

  @Output()
  jumpToLocation: EventEmitter<string> = new EventEmitter(true);

  currentTime = '0';
  comments = '';
  showSaveOption = false;
  annotationList!: Observable<Annotation[]>;

  columnList = ['Time', 'Description', 'Action'];

  constructor(
    private sharedService: SharedService,
    private store$: Store<VideoTrialStoreState.State>
  ) {}

  ngOnInit(): void {
    this.annotationList = this.store$
      .select(VideoTrialStoreSelectors.getCurrentVideo)
      .pipe(
        map((video: TrialVideo) => {
          return video.annotations;
        })
      );
  }

  addAnnotation(): void {
    this.showSaveOption = true;
    this.currentTime = this.sharedService.currentTimeObs$.value.time;
    this.sharedService.pauseVideoObs$.next(true);
    const element = this.commentBox.nativeElement as HTMLInputElement;
    element.focus();
  }

  cancle(): void {
    this.currentTime = '';
    this.comments = '';
    this.showSaveOption = false;
  }

  save(): void {
    this.showSaveOption = false;

    const endtime =
      parseInt(this.sharedService.currentTimeObs$.value.videoPlayerTime, 10) +
      environment.SUBTITLE_TIME;

    const userResponse: Annotation = {
      id: 'annotationId-' + Math.random(),
      time: this.currentTime,
      comments: this.comments,
      videoPlayerTime: this.sharedService.currentTimeObs$.value.videoPlayerTime,
      endtime: this.sharedService.toTimeFormat(endtime.toString()),
    };

    this.store$.dispatch(
      VideoTrialStoreActions.addAnnotations({
        annotationsList: [userResponse],
        videoId: this.videoId,
        procedureId: this.procedureId
      })
    );
    this.currentTime = '';
    this.comments = '';
  }

  deleteAnnotation(id: string): void {
    this.store$.dispatch(
      VideoTrialStoreActions.deleteAnnotation({
        procedureId: this.procedureId,
        videoId: this.videoId,
        id,
      })
    );
  }

  jumpToAnnotaion(annotation: Annotation): void {
    this.sharedService.jumpToAnnotaion.next(annotation.videoPlayerTime);
  }
}
