import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {UserManagementService} from '../user-management.service';
import {LoggerService} from '../logger.service';
import {Store} from '@ngrx/store';
import * as fromHeaderAction from './store/aifmc-header.actions';
import * as fromHeader from './store/aifmc-header.reducer';

@Component({
  selector: 'app-aifmc-header',
  templateUrl: './aifmc-header.component.html'
})
export class AifmcHeaderComponent implements OnInit, OnDestroy {

  headerState: Observable<fromHeader.State>;

  stepSubmit: Subscription;

  constructor(
              private userSvc: UserManagementService,
              private loggerSvc: LoggerService,
              private store: Store<fromHeader.FeatureState>) {
  }

  ngOnDestroy() {
    this.stepSubmit.unsubscribe()
    this.store.dispatch(new fromHeaderAction.ResetOwner());
  }

  ngOnInit() {

    this.stepSubmit = this.userSvc.stepSubmited.subscribe(() => {
      this.reset();
    });
    this.headerState = this.store.select('aifmcHeader');

    // SET OWNERS
    this.store.dispatch(new fromHeaderAction.GetOwners());

  }

  ownerSelected(owner: string) {
    this.store.dispatch(new fromHeaderAction.SelectOwner({owner: owner}));
  }

  repoSelected(repo: string) {
    this.store.dispatch(new fromHeaderAction.SelectRepo({repo: repo}));
  }

  siteSelected(site: string) {
    this.store.dispatch(new fromHeaderAction.SelectSite({site: site}));
  }

  reset() {
    // todo action for reset OWNER
  }
}
