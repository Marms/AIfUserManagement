import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserItem} from '../../services/shared/userItem';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';
import {LoggerService} from '../../services/logger.service';
import {Utils} from '../shared/utils';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.css']
})
export class UserUpdatePasswordComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  users: UserItem[];

  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;
  stepSubmited: Subscription;

  site: string;
  owner: string;
  repo: string;
  owners: string[];

  showForm: boolean;
  showPassword: boolean = false;
  showPleaseSelectOption: boolean;

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService
    , private formFactory: FormFactoryService, private  loggerSvc: LoggerService) {
  }

  ngOnInit() {
    this.initForm();
    this.stepSubmited = this.userSvc.stepSubmited.subscribe(
      () => {
        this.users = [];
        this.showPleaseSelectOption = false;
      }
    );

    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (owner: string) => {
        this.initForm();
        this.owner = owner;
        Utils.setOwner(this.userForm, this.owner);
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (repo: string) => {
        this.initForm();
        this.repo = repo;
        Utils.setRepo(this.userForm, this.owner, this.repo);
      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (site: string) => {
        this.initForm();
        this.showForm = true;
        this.showPleaseSelectOption = false;
        Utils.setSite(this.userForm, this.owner, this.repo, site);

        this.userSvc.getUser(this.repo, site).subscribe(
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
    this.showForm = false;
    this.userForm = this.formFactory.updatePasswordFormulaire();

  }

  initVar() {
    this.showForm = false;
    this.showPleaseSelectOption = false;
    this.userForm.reset();
  }

  onSubmit() {
    console.log(this.userForm.value);
    this.userSvc.saveUser(this.userForm.value);
    this.initVar();
  }

  toggleShowPassword(pass: any) {
    this.showPassword = !this.showPassword;
    console.log(pass);
    if (this.showPassword) {
      pass.type = 'text';
    } else {
      pass.type = 'password';
    }
  }

  eyeClass() {
    if (this.showPassword) {
      return 'fa fa-eye-slash';
    } else {
      return 'fa fa-eye';
    }
  }

  showErrorHelpBlock(controlerName: string, field: string) {
    const control = this.userForm.get(controlerName);
    if (control.touched && null != control.errors && control.errors[field]) {
      return true;
    }
    return false;
  }
}
