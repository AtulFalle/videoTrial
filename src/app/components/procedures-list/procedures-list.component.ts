import { Component, OnInit } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
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
  constructor(
    private store$: Store<VideoTrialStoreState.State>,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe({
        next: (result: EventMessage) => {
          console.log(result);
          if (result?.payload?.account) {
            this.authService.instance.setActiveAccount(result.payload.account);
          }
        },
        error: (error) => console.log(error),
      });
  }

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
    this.store$.dispatch(VideoTrialStoreActions.getUserDetails());

    this.store$
      .select(VideoTrialStoreSelectors.getUserDetails)
      .subscribe((user) => {
        if (user) {
          this.store$.dispatch(VideoTrialStoreActions.getAllProcedures({user}));
          this.isLoadingProcedures$ = this.store$.select(
            VideoTrialStoreSelectors.isLoadingProcedures
          );
          this.procedures$ = this.store$.select(
            VideoTrialStoreSelectors.getProcedures
          );
        }
      });
  }
}
