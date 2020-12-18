import { TrialVideo } from './../../core/models/annotations.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as videoTrialActions from './actions';
import { initialState, State } from './state';

const featureReducer = createReducer(
  initialState,
  on(videoTrialActions.uploadVideo, (state, { video }) => {
    const temp = [...state.video];
    temp.push(video);
    const videoList = [...new Set(temp)];
    // const videoList = [...new Set([temp.video.push(video)])];
    console.log(videoList);
    return {
      ...state,
      isLoading: true,
      error: null,
      video: videoList,
    };
  }),
  on(
    videoTrialActions.addAnnotations,
    (state, { annotationsList, videoId }) => {
      const temp = [...new Set(state.video)];
      const annotations = [];
      for (const iterator of temp) {
        if (iterator.video.videoId === videoId) {
          const tempAnnotations = [...new Set(iterator.annotations)];
          const updatedList = tempAnnotations.concat(annotationsList);

          const videoObject: TrialVideo = {
            video: iterator.video,
            annotations: [...new Set(updatedList)],
            metadata: iterator.metadata,
          };
          const index = temp.indexOf(iterator);
          temp[index] = videoObject;
        }
      }
      console.log(temp);
      return {
        ...state,
        isLoading: true,
        error: null,
        video: temp,
      };
    }
  ),
  on(videoTrialActions.deleteAnnotation, (state, { videoId, id }) => {
    const temp = [...new Set(state.video)];
    const annotations = [];
    for (const iterator of temp) {
      if (iterator.video.videoId === videoId) {
        const tempAnnotations = [...new Set(iterator.annotations)];
        const updatedList = tempAnnotations.filter(
          (iterator) => iterator.id !== id
        );

        const videoObject: TrialVideo = {
          video: iterator.video,
          annotations: [...new Set(updatedList)],
          metadata: iterator.metadata,
        };
        const index = temp.indexOf(iterator);
        temp[index] = videoObject;
      }
    }
    return {
      ...state,
      isLoading: true,
      error: null,
      video: temp,
    };
  }),

  on(videoTrialActions.updateDuration, (state, { time, videoId }) => {
    const temp = [...new Set(state.video)];
    for (const iterator of temp) {
      if (iterator.video.videoId === videoId) {

        iterator.metadata.duration = time;

      }
    }

    return {
      ...state,
      video: temp

    };
  })
);

// tslint:disable-next-line: typedef
export function reducer(state: State | undefined, action: Action) {
  return featureReducer(state, action);
}
