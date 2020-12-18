import { TrialVideo, Annotation } from './../../core/models/annotations.model';

import { createAction, props } from '@ngrx/store';

export enum VideoTrialActionType {
  // video upload actions
  UPLOAD_VIDEO = '[ video ] upload video to server',
  UPLOAD_VIDEO_SUCCESS = '[ video ] upload video to server',

  // annotation actions
  UPDATE_ANNOTATIONS = '[video annotation] add video annotations list',
  ADD_ANNOTATION = '[video annotation] add annotation at time interval ',
  DELETE_ANNOTATION = '[video annotation remove] remove annotation by id',

  // update video values actions
  UPDATE_CURRENT_TIME = '[video current time] update current time of video',
  UPDATE_DURATION = '[video duration] update video duration'
}

export const uploadVideo = createAction(
  VideoTrialActionType.UPLOAD_VIDEO,
  props<{ video: TrialVideo }>()
);
export const uploadVideoSuccess = createAction(
  VideoTrialActionType.UPLOAD_VIDEO_SUCCESS
);

export const addAnnotations = createAction(
  VideoTrialActionType.UPDATE_ANNOTATIONS,
  props<{ annotationsList: Annotation[]; videoId: string }>()
);

export const insertAnnotation = createAction(
  VideoTrialActionType.ADD_ANNOTATION,
  props<{ time: string }>()
);

export const deleteAnnotation = createAction(
  VideoTrialActionType.DELETE_ANNOTATION,
  props<{ videoId: string; id: string }>()
);


export const updateCurrentTime = createAction(
  VideoTrialActionType.UPDATE_CURRENT_TIME,
  props<{time: string, videoId: string}>()
);

export const updateDuration = createAction(
  VideoTrialActionType.UPDATE_DURATION,
  props<{time: string, videoId: string}>()
);
