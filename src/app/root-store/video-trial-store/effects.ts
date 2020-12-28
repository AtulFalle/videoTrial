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
import { DeleteAnnotation } from 'src/app/core/models/annotations.model';

@Injectable()
export class VideoTrialStoreEffects {
  constructor(
    private actions$: Actions,
    private procedureService: ProcedureService
  ) {}

  @Effect()
  getMeatadataInformation = this.actions$.pipe(
    ofType(videoTrialActions.getProcedure),
    switchMap((action) =>
      this.procedureService.getProcedure(action.procedureID)
    ),
    switchMap((procedure: Procedure) => {
      return of(
        videoTrialActions.getProcedureSuccess({
          procedure,
        })
      );
    })
  );

  @Effect()
  deleteAnnotation = this.actions$.pipe(
    ofType(videoTrialActions.deleteAnnotation),
    switchMap((action) => {
      return this.procedureService
        .deleteAnnotation(action.procedureId, action.videoId, action.id)
        .pipe(
          switchMap((res: DeleteAnnotation) => {
            return of(
              videoTrialActions.deleteAnnotationSuccess({
                procedureId: action.procedureId,
                videoId: action.videoId,
                id: action.id,
              })
            );
          })
        );
    })
  );

  /**
   * add annotation action calls AddAnnotation API and updates store with new values
   */
  @Effect()
  addAnnotation = this.actions$.pipe(
    ofType(videoTrialActions.addAnnotations),
    switchMap((action) => {
      return this.procedureService.updateAnnotationList(action.procedureId, action.videoId, action.annotationsList)
        .pipe(
          switchMap((res: Procedure) => {
            return of(
              videoTrialActions.addAnnotationsSucces({
                procedureId: action.procedureId,
                videoId: action.videoId,
               annotationsList: action.annotationsList
              })
            );
          })
        );
    })
  );
}
