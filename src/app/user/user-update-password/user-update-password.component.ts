import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserList} from '../../services/shared/userList';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';
import {LoggerService} from '../../services/logger.service';

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

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService
    , private formFactory: FormFactoryService, private  loggerSvc: LoggerService) {
  }

  ngOnInit() {
    this.initForm();
    this.stepSubmited = this.loggerSvc.logChanged.subscribe(
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
          },
          error1 => this.userSvc.handleError(error1)
        );
      });
  }

  ngOnDestroy() {
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
  }


  initForm() {
    this.userForm = this.formFactory.updatePasswordFormulaire();

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
