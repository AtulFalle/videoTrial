import { FileUploadStatus } from './../../core/enum/file-upload-status.enum';
import { Site, UserMetadata } from './../../core/models/user-roles.model';
import { Video } from './../../core/models/video.model';
import { TrialVideo } from './../../core/models/annotations.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as videoTrialActions from './actions';
import { initialState, State } from './state';
import jwt_decode from 'jwt-decode';
import { User } from 'src/app/core/models/admin.model';

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
            siteRequestStatus: ele.siteRequestStatus,
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
  on(videoTrialActions.updateSelectedStudy, (state, { study }) => {
    return {
      ...state,
      currentStudy: study,
    };
  }),
  on(videoTrialActions.getAllUserSuccess, (state, { users }) => {
    const updatedUserList: User[] = [];
    for (const iterator of users) {
      const temp = { ...iterator };
      updatedUserList.push(temp);
    }
    updatedUserList.map((item) => {
      item.selectedRole = JSON.parse(item.selectedRole);
    });
    return {
      ...state,
      users: updatedUserList,
    };
  }),
  on(videoTrialActions.updateUserStatusAdminSuccess, (state, { user }) => {
    const updatedUserList: User[] = [];
    for (const iterator of state.users) {
      const temp = { ...iterator };
      updatedUserList.push(temp);
    }
    const index = updatedUserList.findIndex(
      (ele) => ele.objectId === user.objectId
    );
    const parsedUser = { ...user };
    parsedUser.selectedRole = JSON.parse(user.selectedRole);
    updatedUserList[index] = parsedUser;
    console.log(updatedUserList);
    return {
      ...state,
      users: updatedUserList,
    };
  }),
  on(videoTrialActions.updateUserStatus, (state, { id, status, objectId }) => {
    const updatedUserList: User[] = [];
    for (const iterator of state.users) {
      const temp = { ...iterator };
      updatedUserList.push(temp);
    }
    const index = updatedUserList.findIndex((ele) => ele.objectId === objectId);
    const tempSelectedRole: any = {};
    if (updatedUserList[index].selectedRole) {
      Object.keys(updatedUserList[index].selectedRole).map((study) => {
        const roleObjArr: any[] = [];
        updatedUserList[index].selectedRole[study].map((roleObj: any) => {
          if (roleObj.id == id) {
            roleObjArr.push({
              id,
              role: roleObj.role,
              site: roleObj.site,
              siteRequestStatus: status,
            });
          } else {
            roleObjArr.push(roleObj);
          }
        });
        tempSelectedRole[study] = roleObjArr;
      });
    }
    updatedUserList[index].selectedRole = tempSelectedRole;

    return {
      ...state,
      users: updatedUserList,
    };
  }),
  on(videoTrialActions.sendChunkSuccess, (state, { file, chunkDetails }) => {
    const fileList = [...state.fileUpload];
    const index = fileList.findIndex((ele) => ele.fileName === file.fileName);
    const fileObject = { ...fileList[index] };
    const chunkDetailList = [...fileObject.chunkDetails];
    chunkDetailList.push(chunkDetails);
    fileObject.chunkDetails = chunkDetailList;
    fileObject.lastChunk = chunkDetails.chunkEnd;
    fileList[index] = fileObject;
    return {
      ...state,
      fileUpload: fileList,
    };
  }),
  on(videoTrialActions.updateStatus, (state, { file, status }) => {
    const fileList = [...state.fileUpload];
    const index = fileList.findIndex((ele) => ele.fileName === file.fileName);
    const fileObject = { ...fileList[index] };
    fileObject.status = status;
    fileList[index] = fileObject;
    return {
      ...state,
      fileUpload: fileList,
    };
  }),
  on(videoTrialActions.commitBlockListSuccess, (state, { file }) => {
    const fileList = [...state.fileUpload];
    const index = fileList.findIndex((ele) => ele.fileName === file.fileName);
    const fileObject = { ...fileList[index] };
    fileObject.status = FileUploadStatus.UPLOADED;
    fileList[index] = fileObject;
    return {
      ...state,
      fileUpload: fileList,
    };
  })
);

// tslint:disable-next-line: typedef
export function reducer(state: State | undefined, action: Action) {
  return featureReducer(state, action);
}
