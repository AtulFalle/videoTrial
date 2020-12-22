import { ProcedureService } from './../../core/services/procedure-service/procedure.service';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  switchMap,
  mergeMap,
} from 'rxjs/operators';

import * as videoTrialActions from './actions';
import { Procedure } from 'src/app/core/models/procedure.model';

@Injectable()
export class VideoTrialStoreEffects {
  constructor(
    private actions$: Actions,
    private procedureService: ProcedureService
  ) {}

  @Effect()
  getMeatadataInformation = this.actions$.pipe(
    ofType(videoTrialActions.getProcedure),
    switchMap(() => this.procedureService.getProcedure()),
    switchMap((procedure: Procedure) => {
      return of(
        videoTrialActions.getProcedureSuccess({
          procedure,
        })
      );
    })
  );
}
