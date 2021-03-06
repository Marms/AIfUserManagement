import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserItem} from '../../services/shared/userItem';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.css']
})
export class UserUpdatePasswordComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  site: string;
  owner: string;
  repo: string;
  owners: string[];
  users: UserItem[];
  disableUserOption: boolean;
  enabled: boolean;
  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;
  stepSubmited: Subscription;
  show: boolean = false;

  toggleShow(pass: any) {
    this.show = !this.show;
    console.log(pass);
    if (this.show) {
      pass.type = 'text';
    } else {
      pass.type = 'password';
    }
  }

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

    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.owner = s;
        this.userForm.get('step.alias.owner').setValue(s);
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.repo = s;
        this.userForm.get('step.alias.owner').setValue(this.owner);
        this.userForm.get('step.alias.repository').setValue(this.repo);
      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.enabled = true;
        this.disableUserOption = false;
        this.userForm.get('step.alias.owner').setValue(this.owner);
        this.userForm.get('step.alias.site').setValue(s);
        this.userForm.get('step.alias.repository').setValue(this.repo);

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
    this.ownerChanged.unsubscribe();
  }


  initForm() {
    this.enabled = false;
    this.userForm = this.formFactory.updatePasswordFormulaire();

  }

  userSelected(username: string) {
    this.disableUserOption = true;
  }

  initVar() {
    this.enabled = false;
    this.disableUserOption = false;
    this.userForm.reset();
  }

  onSubmit() {
    console.log(this.userForm.value);
    this.userSvc.saveUser(this.userForm.value);
    this.initVar();
  }

  eyeClass() {
    if (this.show) {
      return 'fa fa-eye-slash';
    } else {
      return 'fa fa-eye';
    }
  }


  showError(controlerName: string, field: string) {
    const control = this.userForm.get(controlerName);
    if (control.touched && null != control.errors && control.errors[field]) {
      return true;
    }
    return false;
  }

}
