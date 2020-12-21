import { Video } from './video.model';

export interface Annotation {
  id: string;
  time: string;
  comments: string;
  videoPlayerTime: string;
}


export interface Metadata {
  currentTime: string;
  duration: string;
}

export interface TrialVideo {
  video: Video;
  annotations: Annotation[];
  metadata: Metadata;
}
