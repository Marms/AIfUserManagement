import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  owners: string[];
  loaderSubscription: Subscription;
  showLoader;

  constructor() {
    setTheme('bs4');
  }

  ngOnInit() {
    this.owners = [];
    this.showLoader = false;
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }


}
