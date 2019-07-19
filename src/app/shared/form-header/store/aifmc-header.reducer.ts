import * as AifmcHeaderAction from './aifmc-header.actions';

export interface FeatureState {
  aifmcHeader: State;
}

export interface State {
  owner: string;
  setOwner: boolean;
  owners: string[];

  repo: string;
  repos: string[];
  setRepo: boolean;
  setRepos: boolean;

  site: string;
  sites: string[];
  setSite: boolean;
  setSites: boolean;
}

const initialState: State = {
  owner: '',
  setOwner: false,
  owners: [],

  repo: '',
  repos: [],
  setRepo: false,
  setRepos: false,
  site: '',
  sites: [],
  setSite: false,
  setSites: false
};

export function aifMcReducers(state = initialState, action) {
  switch (action.type) {
    case AifmcHeaderAction.SELECT_OWNER:
      return {
        ...state,
        owner: action.payload.owner,
        setOwner: true,
        repos: [],
        sites: [],
        setRepos: false,
        setRepo: false,
        setSites: false,
        setSite: false
      };
    case AifmcHeaderAction.SET_OWNERS:
      return {...state, owners: [...action.payload.owners]};
    case AifmcHeaderAction.RESET_OWNER:
      return {...state, owners: [...state.owners], setOwner: false, repos: [], sites: [], setRepos: false, setRepo: false, setSite: false};

    case AifmcHeaderAction.SET_REPOS:
      return {...state, repos: [...action.payload.repos], setRepos: true};
    case AifmcHeaderAction.SELECT_REPO:
      return {...state, repo: action.payload.repo, setRepo: true, sites: [], setSites: false, setSite: false};

    case AifmcHeaderAction.SET_SITES:
      return {...state, sites: [...action.payload.sites], setSites: true};
    case AifmcHeaderAction.SELECT_SITE:
      return {...state, site: action.payload.site, setSite: true};
    default:
      return state;
  }
}
