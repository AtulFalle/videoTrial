import { Annotation } from './annotations.model';
export interface Video {
  videoId: string;
  name: any;
  subtitles?: string;
  formats?: string[];
  annotations: Annotation[];
}
