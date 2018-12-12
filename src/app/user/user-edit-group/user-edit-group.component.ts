import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserSvcService} from '../../services/user-svc.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifMcSvcService} from '../../services/aif-mc-svc.service';
import {UserList} from '../../services/userList';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html'
})
export class UserEditGroupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  sites: string[];
  users: UserList[];
  disableUserOption: boolean;
  repos: string[];
  showGroupHeader: boolean;

  repo: string;
  repoChanged: Subscription;
  siteChanged: Subscription;

  constructor(private  userSvc: UserSvcService, private aifSvc: AifMcSvcService) {
  }

  ngOnInit() {

    this.initForm();
    this.initVar();

    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        this.userForm.get('step.alias.repo').setValue(this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.userForm.get('step.alias.repo').setValue(this.repo);
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
    this.siteChanged.unsubscribe();
  }

  initForm() {
    this.userForm = new FormGroup({
      'step': new FormGroup({
        'type': new FormControl('addGroups'),
        'alias': new FormGroup({
          'repo': new FormControl('', Validators.required),
          'site': new FormControl('', Validators.required)
        }),
        'user': new FormGroup({
          'username': new FormControl(null, Validators.required),
          'groups': new FormArray([])
        })
      })
    });
  }

  userSelected(username: string) {
    this.disableUserOption = true;
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
    this.userSvc.updateUser(this.userForm.value);
    this.initVar();

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
