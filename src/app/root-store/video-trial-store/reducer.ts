import { Site, UserMetadata } from './../../core/models/user-roles.model';
import { Video } from './../../core/models/video.model';
import { TrialVideo } from './../../core/models/annotations.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as videoTrialActions from './actions';
import { initialState, State } from './state';
import jwt_decode from 'jwt-decode';

const featureReducer = createReducer(
  initialState,

  on(
    videoTrialActions.addAnnotationsSucces,
    (state, { annotationsList, videoId }) => {
      const tempProcedure = { ...state.procedure };
      const temp = [...tempProcedure.video];
      const annotations = [];
      let currentVideo = { ...state.currentVideo };
      for (const iterator of temp) {
        if (iterator.videoId === videoId) {
          const tempAnnotations = [...new Set(iterator.annotations)];
          const updatedList = tempAnnotations.concat(annotationsList);

          const videoObject: Video = {
            name: iterator.name,
            originalName: iterator.originalName,
            videoId: iterator.videoId,
            annotations: [...new Set(updatedList)],
          };
          currentVideo = videoObject;
          const index = temp.indexOf(iterator);
          temp[index] = videoObject;
        }
      }
      tempProcedure.video = temp;

      console.log(temp);
      return {
        ...state,
        isLoading: false,
        error: null,
        video: temp,
        currentVideo,
        procedure: tempProcedure,
      };
    }
  ),
  on(
    videoTrialActions.deleteAnnotationSuccess,
    (state, { procedureId, videoId, id }) => {
      const temp = [...state.procedure.video];
      const currentVideo = { ...state.currentVideo };
      const updatedProcedure = { ...state.procedure };
      for (const iterator of temp) {
        if (iterator.videoId === videoId) {
          const tempAnnotations = [...new Set(iterator.annotations)];
          const updatedList = tempAnnotations.filter((i) => i.id !== id);

          const videoObject: Video = {
            name: iterator.name,
            originalName: iterator.originalName,
            videoId: iterator.videoId,
            annotations: [...new Set(updatedList)],
          };

          currentVideo.annotations = videoObject.annotations;
          const index = temp.indexOf(iterator);
          temp[index] = videoObject;
          updatedProcedure.video = temp;
        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        procedure: updatedProcedure,
        currentVideo,
      };
    }
  ),
  on(videoTrialActions.getProcedure, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(videoTrialActions.getProcedureSuccess, (state, { procedure }) => {
    const currentVideo = { ...procedure.video[0] };

    return {
      ...state,
      procedure,
      isLoading: false,
      currentVideo,
    };
  }),
  on(videoTrialActions.setCurrentVideo, (state, { video }) => {
    return {
      ...state,
      currentVideo: video,
    };
  }),
  on(videoTrialActions.getAllProcedures, (state) => {
    return {
      ...state,
      isLoadingProcedures: true,
    };
  }),
  on(videoTrialActions.getAllProcedureSuccess, (state, { procedures }) => {
    return {
      ...state,
      isLoadingProcedures: false,
      procedures,
    };
  }),
  on(videoTrialActions.updateCurrentVideoTab, (state, { tab }) => {
    return {
      ...state,
      currentTabIndex: tab,
    };
  }),
  on(videoTrialActions.addFilesToUpload, (state, { files }) => {
    return {
      ...state,
      fileUpload: files,
    };
  }),
  on(videoTrialActions.updateFileProgress, (state, { file }) => {
    const files = [...state.fileUpload];
    const index = files.findIndex((ele) => ele.fileName === file.fileName);
    files[index] = file;

    return {
      ...state,
      fileUpload: files,
    };
  }),
  on(videoTrialActions.updateFileStatus, (state, { file }) => {
    const files = [];
    for (const iterator of state.fileUpload) {
      const temp = { ...iterator };
      files.push(temp);
    }
    const index = files.findIndex((ele) => ele.fileName === file.file.fileName);
    if (files[index].status !== file.status) {
      files[index].status = file.status;
    }
    return {
      ...state,
      fileUpload: files,
    };
  }),
  on(videoTrialActions.getUserMetadata, (state) => {
    const token: any = jwt_decode(sessionStorage.getItem('token'));
    const roleData = JSON.parse(token.extension_selectedrole);
    const userRoles: UserMetadata[] = [];
    for (const iterator of Object.keys(roleData)) {
      const temp: UserMetadata = {
        name: iterator,
        site: roleData[iterator].map((ele: any) => {
          const tempSite: Site = {
            name: ele.site,
            role: ele.role,
          };
          return tempSite;
        }),
      };
      userRoles.push(temp);
    }
    return {
      ...state,
      studyList: userRoles,
      currentStudy: userRoles[0].name,
    };
  }),
  on(videoTrialActions.updateSelectedStudy, (state, {study}) => {

    return {
      ...state,
      currentStudy: study
    }
  })
);

// tslint:disable-next-line: typedef
export function reducer(state: State | undefined, action: Action) {
  return featureReducer(state, action);
}
