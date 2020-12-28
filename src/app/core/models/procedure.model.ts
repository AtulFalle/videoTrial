import { Video } from './video.model';
export interface Procedure {
  id?: string;
  date: string;
  patient_id: string;
  procedure_date: string;
  patient_dob: string;
  study: string;
  site: string;
  procedure_type: string;
  conducting_surgeon: string;
  surgical_device_liaison: string;
  total_videos: 0;
  implant: string;
  procedureId: string;
  status: string;
  procedureLength: string;
  video: Video[];
}
