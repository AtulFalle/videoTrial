import { Video } from './../../core/models/video.model';
import { Procedure } from 'src/app/core/models/procedure.model';
import { TrialVideo } from './../../core/models/annotations.model';

export interface State {
  isLoading?: boolean;
  error?: any;
  video: Video[];
  currentVideo: Video;
  procedure: Procedure;
  procedures: Procedure[];
  isLoadingProcedures: boolean;
}

export const initialState: State = {
  isLoading: false,
  error: null,
  video: [
    {
      videoId: 'test',
      name: '',
      originalName: '',
      annotations: [],
    },
  ],
  currentVideo: {
    videoId: 'test',
    name: '',
    originalName: '',
    annotations: [],
  },
  procedure: null,
  procedures: [],
  isLoadingProcedures: false,
};
