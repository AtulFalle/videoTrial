import { TrialVideo } from './models/annotations.model';
export interface Procedure {
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
