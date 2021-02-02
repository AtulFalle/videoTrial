import { Video } from './../../core/models/video.model';
import { Procedure } from 'src/app/core/models/procedure.model';

export interface State {
  isLoading?: boolean;
  error?: any;
  video: Video[];
  currentTabIndex: number;
  currentVideo: Video;
  procedure: Procedure;
  procedures: Procedure[];
  isLoadingProcedures: boolean;
  unscrubbedVideo: Procedure;
}

export const initialState: State = {
  isLoading: false,
  error: null,
  currentTabIndex: 0,
  video: [
    {
      videoId: 'test',
      name: '',
      originalName: '',
      annotations: [],
      type: 'Unscrubbed',

    },
  ],
  currentVideo: {
    videoId: 'test',
    name: '',
    originalName: '',
    annotations: [],
    type: 'Unscrubbed',

  },
  unscrubbedVideo: {
    patientId: 'test',
    procedureDate: 'test',
    patientDob: 'test',
    study: 'test',
    site: 'test',
    procedureType: 'test',
    conductingSurgeon: 'test',
    surgicalDeviceLiaison: 'test',
    total_videos: 1,
    implant: 'test',
    procedureId: 'test',
    status: 'test',
    procedureLength: 'test',
    video: [
      {
        videoId: 'test',
        name: 'test',
        subtitles: 'test',
        formats: [],
        annotations: [],
        type: 'Unscrubbed',
      },
    ],
  },
  procedure: null,
  procedures: [],
  isLoadingProcedures: false,
};
