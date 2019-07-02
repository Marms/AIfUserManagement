import {Action} from '@ngrx/store';

export const GET_OWNERS = 'GET_OWNER';
export const SELECT_OWNER = 'SELECT_OWNER';
export const RESET_OWNER = 'RESET_OWNER';
export const SET_OWNERS = 'SET_OWNERS';

export const GET_REPOS = 'GET_REPOS';
export const SET_REPOS = 'SET_REPOS';
export const SELECT_REPO = 'SELECT_REPO';

export const GET_SITES = 'GET_SITES';
export const SET_SITES = 'SET_SITES';
export const SELECT_SITE = 'SELECT_SITE';

export class SelectOwner implements Action {
  readonly type = SELECT_OWNER;

  constructor(public payload: { owner: string }) {
  }
}

export class ResetOwner implements Action {
  readonly type = RESET_OWNER;
}


export class SetOwners implements Action {
  readonly type = SET_OWNERS;

  constructor(public payload: { owners: string[] }) {
  }
}

export class SetRepos implements Action {
  readonly type = SET_REPOS;

  constructor(public payload: { repos: string[] }) {
  }
}

export class SelectRepo implements Action {
  readonly type = SELECT_REPO;

  constructor(public payload: { repo: string }) {
  }
}

export class SetSites implements Action {
  readonly type = SET_SITES;

  constructor(public payload: { sites: string[] }) {
  }
}

export class SelectSite implements Action {
  readonly type = SELECT_SITE;

  constructor(public payload: { site: string }) {
  }
}

export class GetOwners implements Action {
  readonly type = GET_OWNERS;
}

export class GetRepos implements Action {
  readonly type = GET_REPOS;

  constructor(public payload: { owner: string }) {
  }
}

export class GetSites implements Action {
  readonly type = GET_SITES;
}


export type AifmcHeaderActions =
  SetOwners
  | SelectOwner
  | ResetOwner
  | GetOwners
  | SetRepos
  | SelectRepo
  | GetRepos
  | SetSites
  | SelectSite
  | GetSites ;
