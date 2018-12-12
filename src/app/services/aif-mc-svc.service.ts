import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class AifMcSvcService {
  url: string;

  ownerSubject: Subject<string> = new Subject<string>();
  repoSubject: Subject<string> = new Subject<string>();
  siteSubject: Subject<string> = new Subject<string>();

  constructor(private http: Http) {
    this.url = environment.aifmcUrl  + '/rest/aifra/api/v1/';
  }

  getToken() {
    localStorage.setItem('origin', window.location.origin);

    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('aifmctk')
    });

  }

  getOwners() {
    return this.http.get(this.url + 'owners', {headers: this.getToken()})
      .map((response: Response) => {
        return response.json();
      });
  }

  getRepos(ownerId: string) {
    console.log('ests');
    return this.http.get(this.url + 'owners/' + ownerId + '/repos?foraction=deploy', {headers: this.getToken()})
      .map((response: Response) => {
        return response.json();
      });
  }


  getSites(owner: string, repo: string) {
    return this.http.get(this.url + 'owners/' + owner + '/repos/' + repo + '/sites', {headers: this.getToken()})
      .map((response: Response) => {
        const data = response.json();
        return data;
      });
  }

}
