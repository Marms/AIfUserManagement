import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserItem} from '../../services/shared/userItem';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html'
})
export class UserEditGroupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  users: UserItem[];
  user: UserItem;
  disableUserOption: boolean;
  showGroupHeader: boolean;
  repo: string;
  owner: string;
  groups: UserItem[];
  group: string;
  enabled: boolean = false;

  site: string;

  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;
  stepSubmited: Subscription;

  constructor(private  userSvc: UserManagementService,
              private aifSvc: AifmcService,
              private formFactory: FormFactoryService,
              private loggerSvc: LoggerService) {
  }

  ngOnInit() {

    this.stepSubmited = this.loggerSvc.logChanged.subscribe(() => {
      this.users = [];
      this.disableUserOption = false;
    });
    this.initForm();
    this.initVar();

    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.owner = s;
        this.userForm.get('step.alias.owner').setValue(s);
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        this.userForm.get('step.alias.owner').setValue(this.owner);
        this.userForm.get('step.alias.repository').setValue(this.repo);
      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.enabled = true;
        this.site = s;
        this.userForm.get('step.alias.owner').setValue(this.owner);
        this.userForm.get('step.alias.repository').setValue(this.repo);
        this.userForm.get('step.alias.site').setValue(s);
        this.userSvc.getUser(this.repo, s).subscribe(
          (data: any) => {

            this.users = data.users;
          },
          error1 => this.userSvc.handleError(error1)
        );

        this.userSvc.getGroups(this.repo, s).subscribe(
          (d: any) => {
            this.groups = d.groups;
          },
          error1 => this.userSvc.handleError(error1)
        );

      });
  }

  ngOnDestroy() {
    this.ownerChanged.unsubscribe();
    this.repoChanged.unsubscribe();
    this.stepSubmited.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  initForm() {
    this.enabled = false;
    this.userForm = this.formFactory.userEditFormulaire();
  }

  removeAllGroup() {
    const array = <FormArray> this.userForm.get('step.user.groups');
    while (array.length !== 0) {
      array.removeAt(0);
    }
  }

  userSelected(username: string) {
    this.disableUserOption = true;
    this.removeAllGroup();
    for (const user of this.users) {
      if (username === user.name && user.membership != null) {
        this.user = user;
        for (const group of user.membership) {
          const control = new FormControl();
          control.patchValue(group);
          control.setValidators(Validators.required);
          (<FormArray> this.userForm.get('step.user.groups')).push(control);
        }
      }
    }
    this.showGroupHeader = true;
  }

  initVar() {
    this.enabled = false;
    this.group = '_DONT_ADD_';
    this.showGroupHeader = false;
    this.user = new UserItem();
    this.user.membership = [];
    this.disableUserOption = false;
    this.userForm.reset();
    const array: FormArray = (<FormArray> this.userForm.get('step.user.groups'));
    while (array.length !== 0) {
      array.removeAt(0);
    }
    this.userForm.reset();
  }

  onSubmit() {
    this.userSvc.saveUser(this.userForm.value);
    this.initVar();
  }

  getGroups(): AbstractControl[] {
    return (<FormArray>this.userForm.get('step.user.groups')).controls;
  }

  addOneGroup() {
    if (this.group !== '_DONT_ADD_') {
      console.log(this.group);
      const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
      array.push(new FormControl(this.group, Validators.required));
      this.user.membership.push(this.group);
      const selectTags: HTMLSelectElement = (<HTMLSelectElement> document.getElementById('selectGroup'));
      selectTags.selectedIndex = 0;
      this.group = '_DONT_ADD_';
    }
  }

  deleteGroup(index: number) {
    const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
    const deletedArray: FormArray = (<FormArray>this.userForm.get('step.user.deletedGroups'));
    deletedArray.push(array.controls[index]);
    array.removeAt(index);
    this.user.membership.splice(index, 1);
  }

  groupSelected(group: string) {
    this.group = group;
  }

  /***
   * Parcourt des group et retirer les groupes déjà présent dans l'utilisateur
   */
  getFilteredGroup(): string[] {
    const array: string[] = [];
    for (const gg of this.groups) {
      let trouve = false;
      for (const s of this.user.membership) {
        if (gg.name === s) {
          trouve = true;
        }
      }
      if (!trouve) {
        array.push(gg.name);
      }
    }
    return array;
  }
}
