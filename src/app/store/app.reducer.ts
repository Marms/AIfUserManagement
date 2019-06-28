import {ActionReducerMap} from '@ngrx/store';
import * as fromAifmc from '../shared/form-header/store/aifmc-header.reducer';


export interface AppState {
  aifmcHeader: fromAifmc.State;
}

export const reducers: ActionReducerMap<AppState> = {
  aifmcHeader: fromAifmc.aifMcReducers
};
