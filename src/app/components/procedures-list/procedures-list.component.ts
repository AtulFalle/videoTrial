import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Procedure } from 'src/app/core/models/procedure.model';
import {
  VideoTrialStoreActions,
  VideoTrialStoreSelectors,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';

@Component({
  selector: 'app-procedures-list',
  templateUrl: './procedures-list.component.html',
  styleUrls: ['./procedures-list.component.scss'],
})
export class ProceduresListComponent implements OnInit {
  constructor(private store$: Store<VideoTrialStoreState.State>) {}

  displayedColumns: string[] = [
    'patientId',
    'patientDob',
    'study',
    'procedureType',
    'procedureDate',
    'conductingSurgeon',
    'surgicalDeviceLiaison',
    'procedureActions',
  ];
  isLoadingProcedures$: Observable<boolean>;
  procedures$: Observable<Procedure[]>;

  ngOnInit(): void {
    this.store$.dispatch(VideoTrialStoreActions.getAllProcedures());
    this.isLoadingProcedures$ = this.store$.select(
      VideoTrialStoreSelectors.isLoadingProcedures
    );
    this.procedures$ = this.store$.select(
      VideoTrialStoreSelectors.getProcedures
    );
  }
}
