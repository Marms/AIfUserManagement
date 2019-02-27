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

  constructor(private aifSvc: AifmcService
    , private loaderSvc: LoaderService) {
    setTheme('bs4');
  }

  ngOnInit() {
    this.owners = [];
    this.showLoader = false;

    this.aifSvc.getOwners()
      .subscribe((data: any) => {
        this.owners = data.owners;
      });
    this.loaderSubscription = this.loaderSvc.status.subscribe(
      (val: boolean) => {
        this.showLoader = val;
      }
    );
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }


}
