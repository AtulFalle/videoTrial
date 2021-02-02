import { Video } from './video.model';
export interface Procedure {
  id?: string;
  patientId: string;
  procedureDate: string;
  patientDob: string;
  study: string;
  site: string;
  procedureType: string;
  conductingSurgeon: string;
  surgicalDeviceLiaison: string;
  total_videos: number;
  implant: string;
  procedureId: string;
  status: string;
  procedureLength: string;
  video: Video[];
}
