import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserItem} from '../../services/shared/userItem';
import {AifmcService} from '../../services/aifmc.service';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs';
import {UserManagementService} from '../../services/user-management.service';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-aifmc-header',
  templateUrl: './aifmc-header.component.html'
})
export class AifmcHeaderComponent implements OnInit, OnDestroy {

  sites: string[];
  owners: string[];
  owner: string;
  repos: string[];

  disableOwnerOption: boolean;
  disableRepoOption: boolean;
  disableSiteOption: boolean;

  stepSubmit: Subscription;
  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;

  constructor(private aifSvc: AifmcService,
              private userSvc: UserManagementService,
              private loggerSvc: LoggerService) {
  }

  ngOnDestroy() {
    this.stepSubmit.unsubscribe();
    this.ownerChanged.unsubscribe();
    this.repoChanged.unsubscribe();
    //this.siteChanged.unsubscribe();
  }

  ngOnInit() {
    this.aifSvc.getOwners()
      .subscribe((data: any) => {
          this.owners = data.owners;
        },
        error1 => this.aifSvc.handleError(error1));

    this.stepSubmit = this.loggerSvc.logChanged.subscribe(() => {
      this.reset();
    });

    this.ownerChanged = this.aifSvc.ownerSubject.subscribe((s: string) => {
      this.disableRepoOption = false;
      this.repos = [];

      this.disableSiteOption = false;
      this.sites = [];

      this.aifSvc.getRepos(s)
        .subscribe((data: any) => {
          this.repos = data.repositories;
        }, error1 => {
          this.aifSvc.handleError(error1);
        });
    });

    this.repoChanged = this.aifSvc.repoSubject.subscribe((s: string) => {
      this.disableSiteOption = false;
      this.sites = [];
      this.aifSvc.getSites(this.owner, s)
        .subscribe((site: any) => {
          this.sites = site.sites;
        }, error1 => {
          this.aifSvc.handleError(error1);
        });
    });
  }

  ownerSelected(owner: string) {
    this.owner = owner;
    this.disableOwnerOption = true;
    this.aifSvc.ownerSubject.next(owner);
  }

  repoSelected(repo: string) {
    //   this.sites = [];
    this.disableRepoOption = true;
    this.aifSvc.repoSubject.next(repo);
  }

  siteSelected(site: string) {
    this.disableSiteOption = true;
    this.aifSvc.siteSubject.next(site);
  }

  reset() {
    this.disableSiteOption = false;
    this.disableRepoOption = false;
    this.sites = [];
    this.repos = [];
    this.disableOwnerOption = false;
  }
}
