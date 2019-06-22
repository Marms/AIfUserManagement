import {Component, OnDestroy, OnInit} from '@angular/core';
import {AifmcService} from '../../../shared/aifmc.service';
import {UserManagementService} from '../../../shared/user-management.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFactoryService} from '../../../shared/form-factory.service';
import {Subscription} from 'rxjs';
import {Utils} from '../../../shared/utils';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit, OnDestroy {
  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;

  form: FormGroup;
  repo: string;
  owner: string;
  showForm: boolean = false;

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService, private formFactory: FormFactoryService) {
  }

  ngOnDestroy() {
    this.ownerChanged.unsubscribe();
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.owner = s;
        Utils.setOwner(this.form, this.owner);
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        Utils.setRepo(this.form, this.owner, this.repo);
      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        Utils.setSite(this.form, this.owner, this.repo, s);
        this.showForm = true;
      });
  }

  initForm() {
    this.showForm = false;
    this.form = this.formFactory.createGroupFormulaire();
  }

  onSubmit() {
    this.userSvc.saveGroup(this.form.value);
    this.initForm();

  }

  showError(controlerName: string, field: string) {
    const control = this.form.get(controlerName);
    if (control.touched && null != control.errors && control.errors[field]) {
      return true;
    }
    return false;
  }

}
