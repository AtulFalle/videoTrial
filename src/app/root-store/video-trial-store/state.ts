import { User } from './../../core/models/admin.model';
import { FileMetadata } from './../../core/models/file-upload.model';
import { Video } from './../../core/models/video.model';
import { Procedure } from 'src/app/core/models/procedure.model';
import { UserMetadata } from '../../core/models/user-roles.model';

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
  fileUpload: FileMetadata[];
  studyList: UserMetadata[];
  currentStudy: string;
  users: User[];
  roles: any;
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
        originalName: 'test',
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
  fileUpload: [],
  studyList: [],
  currentStudy: '',
  users: [],
  roles:{}
};
