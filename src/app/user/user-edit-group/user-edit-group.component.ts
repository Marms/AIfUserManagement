import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserList} from '../../services/shared/userList';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html'
})
export class UserEditGroupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  users: UserList[];
  disableUserOption: boolean;
  showGroupHeader: boolean;
  repo: string;
  repoChanged: Subscription;
  siteChanged: Subscription;
  stepSubmited: Subscription;

  constructor(private  userSvc: UserManagementService,
              private aifSvc: AifmcService
    , private formFactory: FormFactoryService) {
  }

  ngOnInit() {
    this.stepSubmited = this.userSvc.logChanged.subscribe(() => {
      this.users = [];
      this.disableUserOption = false;
    });
    this.initForm();
    this.initVar();

    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        this.userForm.get('step.alias.repository').setValue(this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.userForm.get('step.alias.repository').setValue(this.repo);
        this.userForm.get('step.alias.site').setValue(s);
        this.userSvc.getUser(this.repo, s).subscribe(
          (data: any) => {
            this.users = data.users;
          }
        );
      });
  }

  ngOnDestroy() {
    this.repoChanged.unsubscribe();
    this.stepSubmited.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  initForm() {
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
        for (const group of user.membership) {
          const control = new FormControl();
          control.patchValue(group);
          control.setValidators(Validators.required);
          (<FormArray> this.userForm.get('step.user.groups')).push(control);
        }
      }
    }
    this.manageGroupHeader(<FormArray> this.userForm.get('step.user.groups'));
  }

  initVar() {
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
    this.aifSvc;

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
