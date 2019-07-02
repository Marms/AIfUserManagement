import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AifmcActions from './aifmc-header.actions';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map, switchMap, mergeMap, tap} from 'rxjs/operators';

@Injectable()
export class AifmcHeaderEffect {

  url: string;

  constructor(private action$: Actions, private httpClient: HttpClient) {
    this.url = environment.aifmcUrl + '/rest/aifra/api/v1/';

  }

  @Effect()
  getOwner = this.action$
    .pipe(
      ofType(AifmcActions.GET_OWNERS),
      map((action: AifmcActions.GetOwners) => {
        return action.type;
      }),
      switchMap(() => {
        return this.httpClient.get<{ owners: string[] }>(this.url + 'owners', {observe: 'body', responseType: 'json'});
      }),
      mergeMap((data) => {
        return [{type: AifmcActions.SET_OWNERS, payload: {owners: data.owners}}
        ];

      }));

  @Effect()
  getRepos = this.action$
    .pipe(
      ofType(AifmcActions.SELECT_OWNER),
      map((action: AifmcActions.GetRepos) => {
        return action.payload;
      }),
      switchMap((owner) => {
        return this.httpClient.get<{ repositories: string[] }>(this.url + 'owners/' + owner + '/repos?foraction=deploy', {
          observe: 'body',
          responseType: 'json'
        });
      }),
      mergeMap((data) => {
        return [{type: AifmcActions.SET_REPOS, payload: {repos: data.repositories}}];
      })
    );

  @Effect()
  getSites = this.action$
    .pipe(
      ofType(AifmcActions.SELECT_REPO),
      map((action: AifmcActions.GetRepos) => {
        return action.payload;
      }),
      switchMap((repo) => {
        return this.httpClient.get(this.url + 'owners/' + 'TODO' + '/repos/' + repo + '/sites', {observe: 'body', responseType: 'json'});
      }),
      mergeMap((data: { sites: string[] }) => {
        return [{type: AifmcActions.SET_SITES, payload: {sites: data.sites}}];
      })
    );
}
