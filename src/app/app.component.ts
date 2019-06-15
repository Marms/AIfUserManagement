import {Component, OnDestroy, OnInit} from '@angular/core';
import {AifmcService} from './services/aifmc.service';
import {Subscription} from 'rxjs/Subscription';
import {LoaderService} from './services/loader.service';
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
