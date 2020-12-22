import { TrialVideo } from './annotations.model';
export interface Procedure {
  implant: string;
  procedureId: string;
  date: string;
  status: string;
  site: string;
  patientId: string;
  procedureLength: string;
  conductingSurgeon: string;
  surgicalDeviceLiaison: string;
  videoList: TrialVideo[];
}
