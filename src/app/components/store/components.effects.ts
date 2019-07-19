import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, mergeMap} from 'rxjs/operators';

import * as fromComponentsActions from './components.actions';
import * as fromHeaderActions from '../../shared/form-header/store/aifmc-header.actions';
import {UserItem} from '../../shared/pojo/userItem';
import {environment} from '../../../environments/environment';
import {Result} from '../../shared/pojo/result';
import {Step} from '../../shared/pojo/step';
import {Payload} from './components.actions';

@Injectable()
export class ComponentsEffects {

  url: string;

  constructor(private action$: Actions, private httpClient: HttpClient) {
    this.url = environment.afsUserManagerUrl + '/rest/AFSUserManager/v1/';
  }

  @Effect()
  getUsers = this.action$
    .pipe(
      ofType(fromComponentsActions.GET_USERS),
      map((action: fromComponentsActions.GetUsers) => {
        return action.payload.header;
      }),
      switchMap((header: Payload) => {
        return this.httpClient.get<{ users: UserItem[] }>(
          this.url + 'user?repo=' + header.repo + '&site=' + header.site,
          {responseType: 'json', observe: 'body'});
      }),
      mergeMap((data) => {
        console.log(data);
        return [{type: fromComponentsActions.SET_USERS, payload: {users: data.users}}];
      })
    );

  @Effect()
  getGroups = this.action$
    .pipe(
      ofType(fromComponentsActions.GET_GROUPS),
      map((action: fromComponentsActions.GetGroups) => {
        return action.payload.header;
      }),
      switchMap((header: fromComponentsActions.Payload) => {
        return this.httpClient.get<{ groups: String[] }>(
          this.url + 'groups?repo=' + header.repo + '&site=' + header.site,
          {responseType: 'json', observe: 'body'});
      }),
      mergeMap((data) => {
        return [{type: fromComponentsActions.SET_GROUPS, payload: {groups: data.groups}}];
      })
    );

  @Effect()
  saveGroup = this.action$
    .pipe(
      ofType(fromComponentsActions.SAVE_GROUP),
      map((action: fromComponentsActions.SaveGroup) => {
        return action.payload.step;
      }),
      switchMap((step: Step) => {
        return this.httpClient.post<{ results: Result[] }>(this.url + 'groups', step, {responseType: 'json', observe: 'body'});
      }),
      mergeMap((data) => {
        return [{type: fromComponentsActions.MANAGE_RESPONSE, payload: {groups: data.results}},
          {type: fromHeaderActions.RESET_OWNER}];
      })
    );


  @Effect()
  saveUser = this.action$
    .pipe(
      ofType(fromComponentsActions.SAVE_USER),
      map((action: fromComponentsActions.SaveUser) => {
        return action.payload.step;
      }),
      switchMap((step: Step) => {
        return this.httpClient.post<{ results: Result[] }>(this.url + 'user', step, {responseType: 'json', observe: 'body'});
      }),
      mergeMap((data) => {
        return [{type: fromComponentsActions.MANAGE_RESPONSE, payload: {groups: data.results}},
          {type: fromHeaderActions.RESET_OWNER}];

      })
    );
}
