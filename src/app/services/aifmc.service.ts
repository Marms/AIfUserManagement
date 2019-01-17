import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';
import {LoaderService} from './loader.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AifmcService {
  url: string;

  ownerSubject: Subject<string> = new Subject<string>();
  repoSubject: Subject<string> = new Subject<string>();
  siteSubject: Subject<string> = new Subject<string>();

  constructor(private http: Http, private loaderSvc: LoaderService, private loggerSvc: LoggerService) {
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
    return this.http.get(this.url + 'owners', {headers: this.getToken()})
      .map((response: Response) => {
          this.loaderSvc.display(false);
          this.loggerSvc.sendOKmessage('');
        return response.json();
        }
      );
  }


  handleError(error) {
    this.loaderSvc.display(false);
    this.loggerSvc.sendErrorMessage(error.toString());
      console.log(error);
  }

  getRepos(ownerId: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'owners/' + ownerId + '/repos?foraction=deploy', {headers: this.getToken()})
      .map((response: Response) => {
          this.loaderSvc.display(false);
        this.loggerSvc.sendOKmessage('');
        return response.json();
        }
      );
  }


  getSites(owner: string, repo: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'owners/' + owner + '/repos/' + repo + '/sites', {headers: this.getToken()})
      .map((response: Response) => {
        const data = response.json();
        this.loaderSvc.display(false);
        this.loggerSvc.sendOKmessage('');
        return data;
      });
  }

}
