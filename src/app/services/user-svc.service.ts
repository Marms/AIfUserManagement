import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSvcService {
  url: string;

  constructor(private http: Http) {
    this.url = environment.afsUserManagerUrl + '/rest/AFSUserManager/v1/';

  }

  header = new Headers({'Content-Type': 'application/json'});

  createUser(data: any) {
    console.log(data);
  }

  updateUser(data: any) {
    console.log(data);
  }

  getUser(repos: string, site: string) {
    console.log(repos + ' ' + site);
    return this.http.get(this.url + 'users?repo=' + repos + '&site=' + site , {headers: this.header})
      .map((response: Response) => {
        const data = response.json();
        return data;
      });
  }

  getGroups(repos: string, site: string) {
    return this.http.get(this.url + 'groups?repo=' + repos + '&site=' + site , {headers: this.header})
      .map((response: Response) => {
        const data = response.json();
        return data;
      });
  }
}
