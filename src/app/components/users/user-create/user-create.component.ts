import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../../shared/user-management.service';
import {AifmcService} from '../../../shared/aifmc.service';
import {Subscription} from 'rxjs';
import {AifmcHeaderComponent} from '../../../shared/form-header/aifmc-header.component';
import {FormFactoryService} from '../../../shared/form-factory.service';
import {Utils} from '../../../shared/utils';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  repo: string;
  owner: string;
  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;
  showPassword = false;
  showForm = false;

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService,
              private formFactory: FormFactoryService) {
  }

  ngOnDestroy() {
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
    this.ownerChanged.unsubscribe();
  }

  ngOnInit() {
    this.initForm();

    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.owner = s;
        Utils.setOwner(this.userForm, this.owner);

      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        Utils.setRepo(this.userForm, this.owner, this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        Utils.setSite(this.userForm, this.owner, this.repo, s);

        this.showForm = true;
      });
  }

  // creation du formulaire
  initForm() {
    this.showForm = false;
    this.userForm = this.formFactory.createUserFormulaire();
  }

  onSubmit() {
    this.userSvc.saveUser(this.userForm.value);
    this.userForm.reset();
    this.showForm = false;
  }

  toggleShowPassword(pass: any) {
    this.showPassword = !this.showPassword;
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

  showError(controlerName: string, field: string) {
    const control = this.userForm.get(controlerName);
    if (control.touched && null != control.errors && control.errors[field]) {
      return true;
    }
    return false;
  }
}
