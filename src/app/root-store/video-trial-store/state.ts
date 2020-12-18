import { TrialVideo } from 'src/app/core/models/annotations.model';


export interface State {
  isLoading?: boolean;
  error?: any;
  video: TrialVideo[];
}

export const initialState: State = {
  isLoading: false,
  error: null,
  video: []
};
