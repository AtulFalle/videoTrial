import { TrialVideo } from './../../core/models/annotations.model';

export interface State {
  isLoading?: boolean;
  error?: any;
  video: TrialVideo[];
  currentVideo: TrialVideo;
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
};
