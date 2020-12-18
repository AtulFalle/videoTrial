
  import { of } from 'rxjs';
  import { Injectable } from '@angular/core';
  import { Actions, createEffect, ofType } from '@ngrx/effects';
  import { catchError, concatMap, map, switchMap, mergeMap } from 'rxjs/operators';

  import * as videoTrialActions from './actions';


  @Injectable()
  export class VideoTrialStoreEffects {
  constructor(
    private actions$: Actions,

  ) { }


}
