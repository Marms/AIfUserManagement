import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSvcService {
  url: string;

  constructor(private http: Http) {
    this.url = 'http://localhost:8080/rest/aifra/api/v1/';

  }
  header = new Headers({'Content-Type': 'application/json'});

  postStep() {

  }

}
