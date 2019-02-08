import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {LoaderService} from './loader.service';
import {LoggerService} from './logger.service';
import {Result} from './shared/result';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  url: string;
  stepSubmited = new Subject();

  constructor(private http: Http, private loaderSvc: LoaderService, private loggerSvc: LoggerService) {
    this.url = environment.afsUserManagerUrl + '/rest/AFSUserManager/v1/';
  }

  header = new Headers({'Content-Type': 'application/json'});

  saveGroup(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.http.post(this.url + 'groups', step, {headers: this.header})
      .subscribe((response: Response) => {
        this.stepSubmited.next();
        this.manageResult(response.json().results)
        this.loaderSvc.display(false);
      }, error1 => this.handleError(error1));
  }

  saveUser(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.http.post(this.url + 'user', step, {headers: this.header})
      .subscribe((response: Response) => {
        this.stepSubmited.next();
        this.manageResult(response.json().results)
        this.loaderSvc.display(false);
      }, error1 => this.handleError(error1));
  }

  getUser(repos: string, site: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'user?repo=' + repos + '&site=' + site, {headers: this.header})
      .map((response: Response) => {
        this.loggerSvc.sendOKmessage('');
        this.loaderSvc.display(false);
        const data = response.json();
        data.users = data.users.map(u => {
          if (u.membership === undefined) {
            u.membership = [];
          }
          return u;
        });
        return data;
      });
  }

  handleError(error) {
    this.loaderSvc.display(false);
    this.loggerSvc.sendErrorMessage(error);
    console.log(error);
  }

  getGroups(repos: string, site: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'groups?repo=' + repos + '&site=' + site, {headers: this.header})
      .map((response: Response) => {
        this.loggerSvc.sendOKmessage('');
        if (response.status < 200 || response.status >= 300) {
          this.loaderSvc.display(false);
          this.handleError(new Error('This request has failed ' + response.status));
        }
        const data = response.json();
        this.loaderSvc.display(false);
        return data;
      });
  }

  /**
   * Retourn une liste de logs
   */
  getLogs() {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'logs', {headers: this.header})
      .map((response: Response) => {
        this.loggerSvc.sendOKmessage('');
        if (response.status < 200 || response.status >= 300) {
          this.loaderSvc.display(false);
          this.handleError(new Error('This request has failed ' + response.status));
        }
        const data = response.json();
        this.loaderSvc.display(false);
        return data.logs;
      });
  }

  manageResult(results: Result[]) {
    if (this.isAllStateOK(results)) {
      this.loggerSvc.sendOKmessage('OK');
      return;
    }
    this.loggerSvc.sendErrorMessage('please check LOG');
  }
  isAllStateOK(results: Result[]) {
    results = results.filter(r => r.status === 'KO');
    if (null === results || 0 === results.length) {
      return true;
    }
    return false;
  }
}
