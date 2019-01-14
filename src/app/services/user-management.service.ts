import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {StepResult} from './shared/stepResult';
import {Log} from './shared/log';
import {LoaderService} from './loader.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  url: string;

  constructor(private http: Http, private loaderSvc: LoaderService, private loggerSvc: LoggerService) {
    this.url = environment.afsUserManagerUrl + '/rest/AFSUserManager/v1/';
  }

  header = new Headers({'Content-Type': 'application/json'});

  saveGroup(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.http.post(this.url + 'groups', step, {headers: this.header})
      .subscribe((response: Response) => {
        this.loggerSvc.addLog(step, response.json().results);
        this.loaderSvc.display(false);
      }, error1 => this.handleError(error1));
  }

  saveUser(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.http.post(this.url + 'users', step, {headers: this.header})
      .subscribe((response: Response) => {
        this.loggerSvc.addLog(step, response.json().results);
        this.loaderSvc.display(false);
      }, error1 => this.handleError(error1));
  }

  getUser(repos: string, site: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'users?repo=' + repos + '&site=' + site, {headers: this.header})
      .map((response: Response) => {
        this.loaderSvc.display(false);
        const data = response.json();
        return data;
      });
  }

  handleError(error) {
    this.loaderSvc.display(false);
    console.log(error);
  }

  getGroups(repos: string, site: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'groups?repo=' + repos + '&site=' + site, {headers: this.header})
      .map((response: Response) => {
        if (response.status < 200 || response.status >= 300) {
          this.loaderSvc.display(false);
          throw new Error('This request has failed ' + response.status);
        }
        const data = response.json();
        this.loaderSvc.display(false);
        return data;
      });
  }

  /**
   * Retourn une liste de logs
   * @returns {Observable<any>}
   */
  getLogs() {
    this.loaderSvc.display(true);
    return this.http.get(this.url + '', {headers: this.header})
      .map((response: Response) => {
        if (response.status < 200 || response.status >= 300) {
          this.loaderSvc.display(false);
          throw new Error('This request has failed ' + response.status);
        }
        const data = response.json();
        this.loaderSvc.display(false);
        return data;
      });
  }

}
