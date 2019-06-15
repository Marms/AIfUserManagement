import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';
import {LoaderService} from './loader.service';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AifmcService {
  url: string;

  ownerSubject: Subject<string> = new Subject<string>();
  repoSubject: Subject<string> = new Subject<string>();
  siteSubject: Subject<string> = new Subject<string>();

  constructor( private httpClient: HttpClient, private loaderSvc: LoaderService, private loggerSvc: LoggerService) {
    this.url = environment.aifmcUrl + '/rest/aifra/api/v1/';
  }

  getToken() {
    localStorage.setItem('origin', window.location.origin);

    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('aifmctk'),
    });

  }

  getOwners() {
    this.loaderSvc.display(true);
    return this.httpClient.get<{ owners: string[] }>(this.url + 'owners', {observe: 'body', responseType: 'json'})
      .map((re) => {
        return re;
      });
  }


  handleError(error) {
    this.loaderSvc.display(false);
    this.loggerSvc.sendErrorMessage(error.toString());
    console.log(error);
  }

  getRepos(ownerId: string) {
    this.loaderSvc.display(true);
    return this.httpClient.get<{ repos: string[] }>(this.url + 'owners/' + ownerId + '/repos?foraction=deploy', {
      observe: 'body',
      responseType: 'json'
    })
      .map((res) => {
        this.loaderSvc.display(false);
        this.loggerSvc.sendOKmessage('');
        return res;
      });
  }


  getSites(owner: string, repo: string) {
    this.loaderSvc.display(true);
    return this.httpClient.get(this.url + 'owners/' + owner + '/repos/' + repo + '/sites', {observe: 'body', responseType: 'json'})
      .map((response) => {
        this.loaderSvc.display(false);
        this.loggerSvc.sendOKmessage('');
        return response;
      });
  }

}
