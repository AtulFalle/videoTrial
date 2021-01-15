import { Annotation } from './annotations.model';
export interface Video {
  videoId: string;
  name: string;
  originalName: string;
  subtitles?: string;
  formats?: string[];
  annotations: Annotation[];
}
