import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserItem} from '../../services/shared/userItem';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';
import {LoggerService} from '../../services/logger.service';
import {Step} from '../../services/shared/step';

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html'
})
export class UserEditGroupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  users: UserItem[];
  selectedUser: UserItem;
  disableUserOption: boolean;
  showGroupHeader: boolean;
  repo: string;
  owner: string;
  site: string;
  groups: UserItem[];
  selectedGroup: string;
  showForm: boolean;

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
      },
    );

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.showForm = true;
        this.disableUserOption = false;
        this.showGroupHeader = false;

        this.site = s;
        this.userForm.get('step.alias.owner').setValue(this.owner);
        this.userForm.get('step.alias.repository').setValue(this.repo);
        this.userForm.get('step.alias.site').setValue(s);
        this.userSvc.getUser(this.repo, s).subscribe(
          (data: any) => {

            this.users = data.users;
            this.selectedUser = new UserItem();
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
    this.showForm = false;
    this.userForm = this.formFactory.userEditFormulaire();
  }

  nullArray(array) {
    return array === undefined || array === null || array.length === 0;
  }

  removeAllGroup() {
    const array = <FormArray> this.userForm.get('step.user.groups');
    if (!this.nullArray(array)) {
      while (array.length !== 0) {
        array.removeAt(0);
      }
    }
    const deletedArray = <FormArray> this.userForm.get('step.user.deletedGroups');
    if (!this.nullArray(deletedArray)) {
      while (deletedArray.length !== 0) {
        deletedArray.removeAt(0);
      }
    }
  }

  userSelected(username: string) {
    this.showGroupHeader = true;

    this.resetGroup();
    this.disableUserOption = true;

    this.removeAllGroup();
    for (const user of this.users) {
      if (username === user.name) {
        this.selectedUser = user;
        for (const group of user.membership) {
          const control = new FormControl();
          control.patchValue(group);
          control.setValidators(Validators.required);
          (<FormArray> this.userForm.get('step.user.groups')).push(control);
        }
      }
    }
  }

  initVar() {
    this.showForm = false;
    this.selectedGroup = '_DONT_ADD_';
    this.showGroupHeader = false;
    this.selectedUser = new UserItem();
    this.selectedUser.membership = [];
    this.disableUserOption = false;
    this.userForm.reset();
    this.removeAllGroup();
    this.userForm.reset();
  }

  onSubmit() {
    const value = this.userForm.value;
    const res: Step = value.step;
    if (null !== res.user.deletedGroups) {
      res.user.deletedGroups = res.user.deletedGroups.filter(
        s => {
          const arr = res.user.groups.find(g => g === s);
          return undefined === arr;
        }
      );
    }
    this.userSvc.saveUser(value);
    this.initVar();
  }

  getGroups(): AbstractControl[] {
    return (<FormArray>this.userForm.get('step.user.groups')).controls;
  }

  addOneGroup() {
    if (this.selectedGroup !== '_DONT_ADD_') {
      const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
      array.push(new FormControl(this.selectedGroup, Validators.required));
      this.selectedUser.membership.push(this.selectedGroup);
      this.resetGroup();
    }
  }

  resetGroup() {
    const selectTags: HTMLSelectElement = (<HTMLSelectElement> document.getElementById('selectGroup'));
    if (null !==  selectTags) {
      selectTags.selectedIndex = 0;
    }
    this.selectedGroup = '_DONT_ADD_';
  }
  deleteGroup(index: number) {
    const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
    const deletedArray: FormArray = (<FormArray>this.userForm.get('step.user.deletedGroups'));
    deletedArray.push(array.controls[index]);

    array.removeAt(index);
    this.selectedUser.membership.splice(index, 1);
  }

  groupSelected(group: string) {
    this.selectedGroup = group;
  }

  /***
   * Parcourt des groups et retirer ceux déjà présent dans l'utilisateur
   */
  getFilteredGroup(): string[] {
    const array2 = this.groups.filter(group => {
      return undefined === this.selectedUser.membership.find(member => member === group.name);
    });
    return array2.map(item => item.name);
    /* for (const gg of this.groups) {
      let trouve = false;
      for (const s of this.selectedUser.membership) {
        if (gg.name === s) {
          trouve = true;
        }
      }
      if (!trouve) {
        array.push(gg.name);
      }
    }
    return array; */
  }
}
