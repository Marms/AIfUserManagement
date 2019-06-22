import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {LoaderService} from './loader.service';
import {LoggerService} from './logger.service';
import {Result} from './pojo/result';
import {HttpClient} from '@angular/common/http';
import {UserItem} from './pojo/userItem';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  url: string;
  stepSubmited = new Subject();

  constructor(private httpClient: HttpClient, private loaderSvc: LoaderService, private loggerSvc: LoggerService) {
    this.url = environment.afsUserManagerUrl + '/rest/AFSUserManager/v1/';
  }

  header = new Headers({'Content-Type': 'application/json'});

  saveGroup(step: any) {
    this.loaderSvc.display(true);
    this.httpClient.post<{ results: Result[] }>(this.url + 'groups', step, {responseType: 'json', observe: 'body'})
      .subscribe((res) => {
        console.log(res.results);
        this.stepSubmited.next();
        this.manageResult(res.results);
        this.loaderSvc.display(false);
      }, error1 => this.handleError(error1));
  }


  saveUser(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.httpClient.post<{ results: Result[] }>(this.url + 'user', step, {responseType: 'json', observe: 'body'})
      .subscribe((res) => {
        this.stepSubmited.next();
        this.manageResult(res.results);
        this.loaderSvc.display(false);
      }, error1 => this.handleError(error1));
  }

  getUser(repos: string, site: string) {
    this.loaderSvc.display(true);
    return this.httpClient.get<{ users: UserItem[] }>(
      this.url + 'user?repo=' + repos + '&site=' + site,
      {
        responseType: 'json',
        observe: 'body'
      })
      .map((res) => {
        this.loggerSvc.sendOKmessage('');
        this.loaderSvc.display(false);
        const data = res;
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
    return this.httpClient.get<{ groups: String[] }>(
      this.url + 'groups?repo=' + repos + '&site=' + site,
      {
        responseType: 'json',
        observe: 'body'
      })
      .map((res) => {
        this.loggerSvc.sendOKmessage('');
        this.loaderSvc.display(false);
        return res;
      })
      /*.catch((res: any) => {
        this.handleError(new Error('This request has failed '));

      })*/;
  }

  /**
   * Retourn une liste de logs
   */
  getLogs() {
    this.loaderSvc.display(true);
    return this.httpClient.get<{ logs: string[] }>(
      this.url + 'logs',
      {responseType: 'json', observe: 'body'})
      .map((res) => {
        this.loggerSvc.sendOKmessage('');
        this.loaderSvc.display(false);
        return res.logs;
      })
      /*.catch(err => {
        this.handleError(new Error('This request has failed ' + response.status));

      })*/;
  }

  manageResult(results: Result[]) {
    console.log(results);
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
