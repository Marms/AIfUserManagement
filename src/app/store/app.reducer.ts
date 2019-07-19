import {ActionReducerMap} from '@ngrx/store';
import * as fromAifmc from '../shared/form-header/store/aifmc-header.reducer';
import * as fromComponent from '../components/store/components.reducer';


export interface AppState {
  aifmcHeader: fromAifmc.State;
  components: fromComponent.State;
}

export const reducers: ActionReducerMap<AppState> = {
  aifmcHeader: fromAifmc.aifMcReducers,
  components: fromComponent.componentsReducers
};
