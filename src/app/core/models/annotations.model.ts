import { Video } from './video.model';

export interface DeleteAnnotation {
  procedureId: string;
  videoId: string;
  annotationId: string;
}
export interface Annotation {
  id: string;
  time: string;
  comments: string;
  videoPlayerTime: string;
  endtime?: string;
}

export interface Metadata {
  currentTime: string;
  duration: string;
}

export interface TrialVideo {
  video: Video;
  annotations: Annotation[];
  metadata?: Metadata;
}
