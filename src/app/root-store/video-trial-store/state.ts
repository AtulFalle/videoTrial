import { Procedure } from 'src/app/core/models/procedure.model';
import { TrialVideo } from './../../core/models/annotations.model';

export interface State {
  isLoading?: boolean;
  error?: any;
  video: TrialVideo[];
  currentVideo: TrialVideo;
  procedure: Procedure;
}

export const initialState: State = {
  isLoading: false,
  error: null,
  video: [
    {
      video: {
        videoId: 'test',
        data: '',
      },
      annotations: [],
      metadata: {
        currentTime: '0',
        duration: '0',
      },
    },
  ],
  currentVideo: {
    video: {
      videoId: 'test',
      data: '',
    },
    annotations: [],
    metadata: {
      currentTime: '0',
      duration: '0',
    },
  },
  procedure: null
};
