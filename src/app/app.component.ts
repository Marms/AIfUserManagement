import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from './services/user-management.service';
import {AifmcService} from './services/aifmc.service';
import {AbstractControl} from '@angular/forms/src/model';
import {Subscription} from 'rxjs/Subscription';
import {LoaderService} from './services/loader.service';

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
