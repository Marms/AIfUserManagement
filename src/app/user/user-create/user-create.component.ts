import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AifmcService} from '../../services/aifmc.service';
import {Subscription} from 'rxjs/Subscription';
import {AifmcHeaderComponent} from '../form-header/aifmc-header.component';
import {FormFactoryService} from '../../services/form-factory.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
aui
  userForm: FormGroup;
  repo: string;
  owner: string;
  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;
  show: boolean = false;
  enabled: boolean = false;

  toggleShow(pass: any) {
    this.show = !this.show;
    if (this.show) {
      pass.type = 'text';
    } else {
      pass.type = 'password';
    }
  }


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
        this.userForm.get('step.alias.owner').setValue(s);
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        this.userForm.get('step.alias.repository').setValue(this.repo);
        this.userForm.get('step.alias.owner').setValue(this.owner);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.userForm.get('step.alias.owner').setValue(this.owner);
        this.userForm.get('step.alias.repository').setValue(this.repo);
        this.userForm.get('step.alias.site').setValue(s);
        this.enabled = true;
      });
  }

  // creation du formulaire
  initForm() {
    this.enabled = false;
    this.userForm = this.formFactory.createUserFormulaire();
  }

  onSubmit() {
    this.userSvc.saveUser(this.userForm.value);
    this.userForm.reset();
    this.enabled = false;
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
