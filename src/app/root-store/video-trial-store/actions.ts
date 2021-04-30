import { User } from './../../core/models/admin.model';
import {
  ChunkDetails,
  FileMetadata,
} from './../../core/models/file-upload.model';
import { Video } from './../../core/models/video.model';
import { Procedure } from './../../core/models/procedure.model';
import { TrialVideo, Annotation } from './../../core/models/annotations.model';

import { createAction, props } from '@ngrx/store';
import { UserMetadata } from 'src/app/core/models/user-roles.model';

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

  // File upload Actions
  FILES_SELECTED = '[Video File Selected] file is selected to uplaoad',
  UPDATE_PROGRESS_STATUS = '[Video File progress Update] update the progress for file',
  UPDATE_UPLOAD_STATUS = '[Video File Status Update] update the status for file',

  // get/set User Study and Site metadata
  GET_USER_METADATA = '[User Metadata ] get User metadata ',
  UPDATE_SELECTED_STUDY = '[User Metadata] update User metadata current selected study',

  GET_ALL_USER = '[USER GET] get all user Details',
  GET_ALL_USER_SUCCESS = '[USER GET SUCCESS] get all user Details',

  GET_USER_DETAILS = '[USER Get ] get user details by id',
  GET_USER_DETAILS_SUCCESS = '[USER Get Success] get user details by id Success',

  UPDATE_USER_DUMMY = '[USER UPDATE DUMMY] update the user status',
  UPDATE_USER = '[USER UPDATE] update the user status',
  UPDATE_USER_SUCCESS = '[USER UPDATE SUCCESS] update the user status',

  // file upload chunks
  SEND_CHUNK = '[FileMetadata] send chunk of file',
  SEND_CHUNK_SUCCESS = '[FileMetadata success] send chunk of file success',
  UPDATE_STATUS = '[ string ] update status of file',
  PAUSE_UPLOAD = '[FileMetadata Pause] pause file upload',
  RESUME_UPLOAD = '[FileMEtadata Resume] resume sending the file',
  UPDATE_URL = '[FileMetadata Update url ] update the file user by Storage blob url',

  COMMIT_BLOCKLIST = '[string[] commit] commit the uploaded blobs',
  COMMIT_BLOCKLIST_SUCCESS = '[string] commit blob successfull',
  GET_ALL_ROLE = '[GET ALL ROLE ] get all roles',
  GET_ALL_ROLE_SUCCESS = '[GET ALL ROLE SUCCESS] get all roles',
  UPDATE_USER_ROLE = '[UPDATE USER ROLE ] update user role',
  GET_FILTERED_USER = '[USER GET] get all user Details',
  GET_FILTERED_USER_SUCCESS = '[USER GET SUCCESS] get all user Details',
}

export const editAnnotation = createAction(
  VideoTrialActionType.EDIT_ANNOTATION,
  props<{ annotation: Annotation; videoId: string }>()
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
  VideoTrialActionType.GET_ALL_PROCEDURE,
  props<{ user: User }>()
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

export const addFilesToUpload = createAction(
  VideoTrialActionType.FILES_SELECTED,
  props<{ files: FileMetadata[] }>()
);

export const updateFileProgress = createAction(
  VideoTrialActionType.UPDATE_PROGRESS_STATUS,
  props<{ file: FileMetadata }>()
);

export const updateFileStatus = createAction(
  VideoTrialActionType.UPDATE_UPLOAD_STATUS,
  props<{ file: FileMetadata }>()
);

export const getUserMetadata = createAction(
  VideoTrialActionType.GET_USER_METADATA
);

export const updateSelectedStudy = createAction(
  VideoTrialActionType.UPDATE_SELECTED_STUDY,
  props<{ study: string }>()
);

export const getAllUserSuccess = createAction(
  VideoTrialActionType.GET_ALL_USER_SUCCESS,
  props<{ users: User[] }>()
);
export const getAllUser = createAction(VideoTrialActionType.GET_ALL_USER);
export const updateUserStatus = createAction(
  VideoTrialActionType.UPDATE_USER_DUMMY,
  props<{ id: string; status: string; objectId: string }>()
);
export const updateUserStatusAdmin = createAction(
  VideoTrialActionType.UPDATE_USER,
  props<{ objectId: string; selectedRole: any }>()
);
export const updateUserStatusAdminSuccess = createAction(
  VideoTrialActionType.UPDATE_USER_SUCCESS,
  props<{ user: User }>()
);

export const sendChunk = createAction(
  VideoTrialActionType.SEND_CHUNK,
  props<{ file: FileMetadata }>()
);

export const sendChunkSuccess = createAction(
  VideoTrialActionType.SEND_CHUNK_SUCCESS,
  props<{ file: FileMetadata; chunkDetails: ChunkDetails }>()
);

export const updateStatus = createAction(
  VideoTrialActionType.UPDATE_STATUS,
  props<{ file: FileMetadata; status: string }>()
);

export const pauseUpload = createAction(
  VideoTrialActionType.PAUSE_UPLOAD,
  props<{ file: FileMetadata }>()
);

export const resumeUpload = createAction(
  VideoTrialActionType.RESUME_UPLOAD,
  props<{ file: FileMetadata }>()
);

export const commitBlockList = createAction(
  VideoTrialActionType.COMMIT_BLOCKLIST,
  props<{ file: FileMetadata }>()
);

export const commitBlockListSuccess = createAction(
  VideoTrialActionType.COMMIT_BLOCKLIST_SUCCESS,
  props<{ file: FileMetadata }>()
);

export const getUserDetails = createAction(
  VideoTrialActionType.GET_USER_DETAILS
);

export const getUserDetailsSuccess = createAction(
  VideoTrialActionType.GET_USER_DETAILS_SUCCESS,
  props<{ user: User }>()
);

export const getAllRoleSuccess = createAction(
  VideoTrialActionType.GET_ALL_ROLE,
  props<{ roles: any }>()
);
export const getAllRole = createAction(
  VideoTrialActionType.GET_ALL_ROLE_SUCCESS
);
export const updateUserRoles = createAction(
  VideoTrialActionType.UPDATE_USER_ROLE,
  props<{ emailId: string; selectedRole: any }>()
);
export const getFilteredUserSuccess = createAction(
  VideoTrialActionType.GET_FILTERED_USER_SUCCESS,
  props<{ users: User[] }>()
);

export const updateVideoUrl = createAction(
  VideoTrialActionType.UPDATE_URL,
  props<{ fileName: string; url: string }>()
);
export const getFilteredUser = createAction(
  VideoTrialActionType.GET_FILTERED_USER
);
