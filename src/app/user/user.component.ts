import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../services/loader.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy{

  loaderSubscription: Subscription;

  showLoader;

  constructor(private loaderSvc: LoaderService) {
  }

  ngOnInit() {
    this.showLoader = false;
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
