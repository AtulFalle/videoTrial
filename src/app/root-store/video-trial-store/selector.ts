import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './state';

export const selectVideoState = createFeatureSelector<State>('videoTrial');

export const getVideoList = createSelector(selectVideoState, (state: State) => {
  console.log(state);
  return state.video;
});

export const getCurrentVideo = createSelector(
  selectVideoState,
  (state: State) => {
    return state.currentVideo;
  }
);

export const getProcedure = createSelector(selectVideoState, (state: State) => {
  return state.procedure;
});

export const isLoading = createSelector(
  selectVideoState,
  (state: State) => state.isLoading
);

export const isLoadingProcedures = createSelector(
  selectVideoState,
  (state: State) => state.isLoadingProcedures
);

export const getProcedures = createSelector(
  selectVideoState,
  (state: State) => state.procedures
);
