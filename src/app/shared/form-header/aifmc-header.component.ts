import {Component, OnDestroy, OnInit} from '@angular/core';
import {AifmcService} from '../aifmc.service';
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

  ownerChanged: Subscription;
  siteChanged: Subscription;
  repoChanged: Subscription;

  constructor(private aifSvc: AifmcService,
              private userSvc: UserManagementService,
              private loggerSvc: LoggerService,
              private store: Store<fromHeader.FeatureState>) {
  }

  ngOnDestroy() {
    this.stepSubmit.unsubscribe();
    this.ownerChanged.unsubscribe();
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {

    this.stepSubmit = this.userSvc.stepSubmited.subscribe(() => {
      this.reset();
    });
    this.headerState = this.store.select('aifmcHeader');


    // SET OWNERS
    this.ownerChanged = this.aifSvc.getOwners()
      .subscribe((data: any) => {
          this.store.dispatch(new fromHeaderAction.SetOwners({owners: data.owners}));
        },
        error1 => this.aifSvc.handleError(error1));

    // SET_REPOS
    this.repoChanged = this.store.select('aifmcHeader').subscribe(
      (action) => {
        if (action.setOwner && !action.setRepo && !action.setRepos) {
          this.aifSvc.getRepos(action.owner)
            .subscribe((data: any) => {
              this.store.dispatch(new fromHeaderAction.SetRepos({repos: data.repositories}));
            }, error1 => {
              this.aifSvc.handleError(error1);
            });
        }
      });

    // SET_SITES
    this.siteChanged = this.store.select('aifmcHeader')
      .subscribe(action => {
        if (!action.setSite && !action.setSites && action.setRepo) {
          this.aifSvc.getSites(action.owner, action.repo)
            .subscribe((site: any) => {
              this.store.dispatch(new fromHeaderAction.SetSites({sites: site.sites}));
            }, error1 => {
              this.aifSvc.handleError(error1);
            });
        }
      });
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
