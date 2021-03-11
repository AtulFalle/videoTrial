import { Video } from './../../core/models/video.model';
import { Procedure } from './../../core/models/procedure.model';
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
  DELETE_ANNOTATION_SUCCESS = '[video annotation delete success] annotation removed successfully',
  ADD_ANNOTATION_SUCCESS = '[video annotation add success] vido annotation added successfully',
  EDIT_ANNOTATION = '[Video Annotation Edit] edit specific annotation by ID',

  // update video values actions
  UPDATE_CURRENT_TIME = '[video current time] update current time of video',
  UPDATE_DURATION = '[video duration] update video duration',

  // procedure Actions
  GET_PROCEDURE = '[Procedure GET] get procedure Details',
  GET_PROCEDURE_SUCCESS = '[Procedure success] get procedure Details successfully',
  GET_ALL_PROCEDURE = '[Procedures GET] get all procedures Details',
  GET_ALL_PROCEDURE_SUCCESS = '[Procedures Success] get all procedures successfully',

  // Current video update
  SET_CURRENT_VIDEO = '[Trial video current video] set current video',
  UPDATE_CURRENT_VIDEO = '[Trial video update] update metadata for current video',

  // video scrubbed or unscrubbed
  VIDEO_TAB_CHANGED = '[video current tab] update current video tab',
}

export const editAnnotation = createAction(
  VideoTrialActionType.EDIT_ANNOTATION,
  props<{ annotation: Annotation, videoId: string }>()
);
export const uploadVideo = createAction(
  VideoTrialActionType.UPLOAD_VIDEO,
  props<{ video: TrialVideo }>()
);
export const uploadVideoSuccess = createAction(
  VideoTrialActionType.UPLOAD_VIDEO_SUCCESS
);

export const addAnnotations = createAction(
  VideoTrialActionType.UPDATE_ANNOTATIONS,
  props<{
    annotationsList: Annotation[];
    videoId: string;
    procedureId: string;
  }>()
);

export const addAnnotationsSucces = createAction(
  VideoTrialActionType.ADD_ANNOTATION_SUCCESS,
  props<{
    annotationsList: Annotation[];
    videoId: string;
    procedureId: string;
  }>()
);

export const insertAnnotation = createAction(
  VideoTrialActionType.ADD_ANNOTATION,
  props<{ time: string }>()
);

export const deleteAnnotation = createAction(
  VideoTrialActionType.DELETE_ANNOTATION,
  props<{ procedureId: string; videoId: string; id: string }>()
);

export const deleteAnnotationSuccess = createAction(
  VideoTrialActionType.DELETE_ANNOTATION_SUCCESS,
  props<{ procedureId: string; videoId: string; id: string }>()
);

export const updateCurrentTime = createAction(
  VideoTrialActionType.UPDATE_CURRENT_TIME,
  props<{ time: string; videoId: string }>()
);

export const updateDuration = createAction(
  VideoTrialActionType.UPDATE_DURATION,
  props<{ time: string; videoId: string }>()
);

export const getProcedure = createAction(
  VideoTrialActionType.GET_PROCEDURE,
  props<{ procedureID: string }>()
);

export const getProcedureSuccess = createAction(
  VideoTrialActionType.GET_PROCEDURE_SUCCESS,
  props<{ procedure: Procedure }>()
);

export const getAllProcedures = createAction(
  VideoTrialActionType.GET_ALL_PROCEDURE
);

export const getAllProcedureSuccess = createAction(
  VideoTrialActionType.GET_ALL_PROCEDURE_SUCCESS,
  props<{ procedures: Procedure[] }>()
);

export const setCurrentVideo = createAction(
  VideoTrialActionType.SET_CURRENT_VIDEO,
  props<{ video: Video }>()
);

export const updateCurrentVideo = createAction(
  VideoTrialActionType.UPDATE_CURRENT_VIDEO,
  props<{ video: Video }>()
);

export const updateCurrentVideoTab = createAction(
  VideoTrialActionType.VIDEO_TAB_CHANGED,
  props<{ tab: number }>()
);
