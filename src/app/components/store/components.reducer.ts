import * as fromActions from './components.actions';
import {UserItem} from '../../shared/pojo/userItem';
import {Payload} from './components.actions';
import {Step} from '../../shared/pojo/step';
import {Result} from '../../shared/pojo/result';
import {FormArray, FormControl, Validators} from '@angular/forms';
import {from} from 'rxjs';

export interface FeatureState {
  components: State;
}

export interface State {
  actionName;
  step: Step;
  results: Result[];
  user: UserItem;
  users: UserItem[];
  group: string;
  groups: UserItem[];
  deletedGroup: string[];
  header: Payload;
  userSeted: boolean;
  groupSeted: boolean;
}

const initialState: State = {
    actionName: '',
    deletedGroup: [],
    step: null,
    results: [],
    user: null,
    users: [],
    group: null,
    groups: [],
    header: {owner: '', repo: '', site: ''},
    userSeted: false,
    groupSeted: false
  }
;

function removeGroup(memberShip: string[], groupname:string) {
  let i = 0;
  for (const member of memberShip) {
    if (member === groupname) {
      memberShip.splice(i, 1);
    }
    i++;
  }
  return memberShip;
}

export function componentsReducers(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case fromActions.RESET_USERS:
      return {...state, users: [], userSeted: false, actionName: fromActions.RESET_USERS};
    case fromActions.RESET_GROUPS:
      return {...state, deletedGroup: [], groups: [], groupSeted: false, actionName: fromActions.RESET_GROUPS};
    case fromActions.SET_USERS:
      return {...state, users: action.payload.users, groups: [], userSeted: true, actionName: fromActions.SET_USERS};
    case fromActions.SET_GROUPS:
      return {...state, groups: action.payload.groups, groupSeted: true, actionName: fromActions.SET_GROUPS};
    case fromActions.SELECT_USER:
      for (const user of state.users) {
        if (action.payload.username === user.name) {
          const selectedUser = user;
          if (undefined === user.membership) {
            user.membership = [];
          }
          return {...state, deletedGroup: [], user: selectedUser, actionName: fromActions.SELECT_USER};
        }
      }
      return state;
    case fromActions.SELECT_GROUP:
      return {...state, group: action.payload.groupname, actionName: fromActions.SELECT_GROUP};
    case fromActions.ADD_GROUP:
      if (state.group !== '_DONT_ADD_') {
        state.deletedGroup = removeGroup(state.deletedGroup, state.group);
        state.user.membership.push(state.group);
      }
      return {...state, user: state.user, deletedGroup: state.deletedGroup, actionName: fromActions.ADD_GROUP};
    case fromActions.REMOVE_GROUP:
      state.user.membership = removeGroup(state.user.membership, action.payload.groupname);
      return {
        ...state,
        user: state.user,
        deletedGroup: [action.payload.groupname, state.deletedGroup],
        actionName: fromActions.REMOVE_GROUP
      };
    default:
      return state;

  }
}
