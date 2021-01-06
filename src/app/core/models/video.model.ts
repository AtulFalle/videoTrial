import { Annotation } from './annotations.model';

export enum VideoType {
  srubbed = 'Scrubbed',
  unscrubbed = 'Unscrubbed',
}

export interface Video {
  videoId: string;
  name: any;
  subtitles?: string;
  formats?: string[];
  annotations: Annotation[];
  type?: string;
}
