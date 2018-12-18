import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {StepResult} from './shared/stepResult';
import {Log} from './shared/log';
import {LoaderService} from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  url: string;
  logChanged: Subject<Log[]> = new Subject<Log[]>();

  logs: Log[] = [] ;

  constructor(private http: Http, private loaderSvc: LoaderService) {
    this.url = environment.afsUserManagerUrl + '/rest/AFSUserManager/v1/';
  }

  header = new Headers({'Content-Type': 'application/json'});

  saveGroup(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.http.post(this.url + 'groups', step, {headers: this.header})
      .subscribe((response: Response) => {
        const log = new Log();
        log.results = response.json().results;
        log.step = step.step;
        this.logs.push(log);
        this.logChanged.next(this.getLogs());
        this.loaderSvc.display(false);
      });
  }

  saveUser(step: any) {
    console.log(step);
    this.loaderSvc.display(true);
    this.http.post(this.url + 'users', step, {headers: this.header})
    .subscribe((response: Response) => {
        const log = new Log();
        log.results = response.json().results;
        log.step = step.step;
        this.logs.push(log);
        this.logChanged.next(this.getLogs());
        this.loaderSvc.display(false);
      });
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

  getGroups(repos: string, site: string) {
    this.loaderSvc.display(true);
    return this.http.get(this.url + 'groups?repo=' + repos + '&site=' + site, {headers: this.header})
      .map((response: Response) => {
        const data = response.json();
        this.loaderSvc.display(false);
        return data;
      });
  }

  getLogs(): Log[] {
    return this.logs.slice();
  }
}
