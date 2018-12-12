import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserSvcService} from './services/user-svc.service';
import {AifMcSvcService} from './services/aif-mc-svc.service';
import {AbstractControl} from '@angular/forms/src/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userForm: FormGroup;
  sites: string[];
  owners: string[];
  ownerSelect: string;
  disableOwnerOption: boolean;
  disableRepoOption: boolean;
  disableSiteOption: boolean;
  repos: string[];
  showGroupHeader: boolean;

  constructor(private  userSvc: UserSvcService, private aifSvc: AifMcSvcService) {
  }

  ngOnInit() {
    this.disableOwnerOption = false;
    this.sites = [];
    this.owners = [];
    this.repos = [];
    this.initForm();

    this.aifSvc.getOwners()
      .subscribe((data: any) => {
        this.owners = data.owners;
      });
  }

  // creation du formulaire
  initForm() {
    this.userForm = new FormGroup({
      'step': new FormGroup({
        'type': new FormControl('createUser'),
        'siteServers': new FormGroup({
          'repo': new FormControl('', Validators.required),
          'site': new FormControl('', Validators.required)
        }),
        'user': new FormGroup({
          'username': new FormControl(null, Validators.required),
          'password': new FormControl(null, Validators.required),
          'groups': new FormArray([])
        })
      })
    });
  }

  ownerSelected(owner: string) {
    this.disableOwnerOption = true;
    this.ownerSelect = owner;
    this.aifSvc.getRepos(owner)
      .subscribe((data: any) => {
        this.repos = data.repositories;
      });
  }

  repoSelected(repo: string) {
    this.disableRepoOption = true;
    this.aifSvc.getSites(this.ownerSelect, repo)
      .subscribe((test: any) => {
        this.sites = test.sites;
      });
  }

  siteSelected() {
    this.disableSiteOption = true;
  }

  onSubmit() {
    this.ownerSelect = '';
    this.disableOwnerOption = false;
    this.disableRepoOption = false;
    this.disableSiteOption = false;
    console.log(this.userForm.value);
    this.userForm.reset();
    this.repos = [];
    this.sites = [];
  }

  getGroups(): AbstractControl[] {
    return (<FormArray>this.userForm.get('step.user.groups')).controls;
  }
  addGroup() {
    const array: FormArray = (<FormArray>this.userForm.get('step').get('user').get('groups'));
    array.push(new FormControl('', Validators.required));
    this.manageGroupHeader(array);
  }

  deleteGroup(index: number) {
    const array: FormArray = (<FormArray>this.userForm.get('step').get('user').get('groups'));
    array.removeAt(index);
    this.manageGroupHeader(array);
  }

  manageGroupHeader(array: FormArray) {
    if (array.length === 0) {
      this.showGroupHeader = false;
    } else {
      this.showGroupHeader = true;
    }
  }
}
