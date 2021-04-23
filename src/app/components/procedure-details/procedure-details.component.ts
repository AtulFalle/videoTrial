import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Procedure } from 'src/app/core/models/procedure.model';
import {
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';

@Component({
  selector: 'app-procedure-details',
  templateUrl: './procedure-details.component.html',
  styleUrls: ['./procedure-details.component.scss'],
})
export class ProcedureDetailsComponent implements OnInit {
  procedureDetail!: Observable<Procedure>;
  userRole: any;
  constructor(private store$: Store<VideoTrialStoreState.State>) {}

  ngOnInit(): void {
    this.store$
      .select(VideoTrialStoreSelectors.getUserDetails)
      .subscribe((user) => {
        this.procedureDetail = this.store$.select(
          VideoTrialStoreSelectors.getProcedure
        );
      });
  }
}
