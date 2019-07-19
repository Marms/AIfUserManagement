import {Action} from '@ngrx/store';
import {UserItem} from '../../shared/pojo/userItem';
import {Step} from '../../shared/pojo/step';
import {Result} from '../../shared/pojo/result';

export const SET_USERS = 'SET_USERS';
export const SAVE_USER = 'SAVE_USER';
export const GET_USERS = 'GET_USERS';
export const RESET_USERS = 'RESET_USERS';
export const SELECT_USER = 'SELECT_USER';

export const SET_GROUPS = 'SET_GROUPS';
export const GET_GROUPS = 'GET_GROUPS';
export const RESET_GROUPS = 'RESET_GROUPS';
export const SELECT_GROUP = 'SELECT_GROUP';
export const SAVE_GROUP = 'SAVE_GROUP';
export const ADD_GROUP = 'ADD_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const STEP_SUBMITED = 'STEP_SUBMITED';
export const MANAGE_RESPONSE = 'MANAGE_RESPONSE';


export class Payload {
  owner: string; repo: string; site: string;
}


export class ManageResponse implements Action {
  readonly type = MANAGE_RESPONSE;
  constructor(public payload: {results: Result[]}) {
  }
}


export class SaveUser implements Action {
  readonly type = SAVE_USER;
  constructor(public payload: {step: Step}) {
  }
}

export class SetUsers implements Action {
  readonly type = SET_USERS;

  constructor(public payload: { users: UserItem[] }) {
  }
}

export class GetUsers implements Action {
  readonly type = GET_USERS;
  constructor (public payload:  {header: Payload} ) {}
}

export class ResetUsers implements Action {
  readonly type = RESET_USERS;
}

export class SelectUser implements Action {
  readonly type = SELECT_USER;

  constructor(public payload: { username: string }) {
  }
}

export class SetGroups implements Action {
  readonly type = SET_GROUPS;

  constructor(public payload: { users: UserItem[] }) {
  }
}

export class GetGroups implements Action {
  readonly type = GET_GROUPS;
  constructor (public payload:  {header: Payload} ) {}

}

export class ResetGroups implements Action {
  readonly type = RESET_GROUPS;
}

export class SelectGroup implements Action {
  readonly type = SELECT_GROUP;

  constructor(public payload: { groupname: string }) {
  }
}

export class AddGroup implements Action {
  readonly type = ADD_GROUP;
}
export class RemoveGroup implements Action {
  readonly type = REMOVE_GROUP;
  constructor(public payload: {groupname: string}){}
}

export class StepSubmited implements Action {
  readonly type = STEP_SUBMITED;
}

export class SaveGroup implements Action {
  readonly type = SAVE_GROUP;
  constructor(public payload: {step: Step}) {}
}
export type ComponentsActions = SetUsers | GetUsers | ResetUsers | SelectUser | SetGroups | GetGroups | ResetGroups | SelectGroup | StepSubmited | SaveUser | SaveGroup | AddGroup | RemoveGroup | ManageResponse;
