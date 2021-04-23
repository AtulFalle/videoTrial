export interface UserMetadata {
  name: string;
  site: Site[];
}

export interface Site {
  name: string;
  role: string;
  siteRequestStatus: string;
}

export interface ProcedureAccess {
  site: string;
  study: string;
}
