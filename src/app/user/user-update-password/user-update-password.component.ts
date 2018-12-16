import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserList} from '../../services/shared/userList';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html'
})
export class UserUpdatePasswordComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  site: string;
  repo: string;
  owners: string[];
  users: UserList[];
  disableUserOption: boolean;
  repoChanged: Subscription;
  siteChanged: Subscription;
  stepSubmited: Subscription;

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService) {
  }

  ngOnInit() {
    this.initForm();
    this.stepSubmited = this.userSvc.logChanged.subscribe(
      () => {
        this.users = [];
        this.disableUserOption = false;
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.userForm.get('step.alias.repository').setValue(this.repo);
      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.disableUserOption = false;
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
        'type': new FormControl('updatePassword'),
        'alias': new FormGroup({
          'owner': new FormControl(),
          'repository': new FormControl('', Validators.required),
          'site': new FormControl('', Validators.required)
        }),
        'user': new FormGroup({
          'username': new FormControl(null, Validators.required),
          'password': new FormControl(null, Validators.required),
        })
      })
    });
  }

  userSelected(username: string) {
    this.disableUserOption = true;
  }

  initVar() {
    this.disableUserOption = false;
    this.userForm.reset();
  }

  onSubmit() {
    console.log(this.userForm.value);
    this.userSvc.saveUser(this.userForm.value);
    this.initVar();

  }

}
