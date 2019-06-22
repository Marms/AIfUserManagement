import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { FormGroup} from '@angular/forms';
import {UserManagementService} from '../../../shared/user-management.service';
import {AifmcService} from '../../../shared/aifmc.service';
import {UserItem} from '../../../shared/pojo/userItem';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../../shared/form-factory.service';
import {LoggerService} from '../../../shared/logger.service';
import {Utils} from '../../../shared/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  user: string;

  showForm: boolean;
  showPassword: boolean = false;
  showPleaseSelectOption: boolean;

  modalRef: BsModalRef;


  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService
    , private formFactory: FormFactoryService, private  loggerSvc: LoggerService,
              private modalService: BsModalService) {
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
        this.site = site;
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
    this.user = '';
    this.showPleaseSelectOption = false;
    this.userForm.reset();
  }

  onSubmit() {
    this.userSvc.saveUser(this.userForm.value);
    this.initVar();
    this.modalRef.hide();

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


  openModal(template: TemplateRef<any>) {
    this.user = this.userForm.get('step.user.username').value;
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  decline(): void {
    this.modalRef.hide();
  }
}
// http://valor-software.com/ngx-bootstrap/#/modals
