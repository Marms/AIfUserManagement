import {Component, OnDestroy, OnInit} from '@angular/core';
import {AifmcService} from '../../services/aifmc.service';
import {UserManagementService} from '../../services/user-management.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFactoryService} from '../../services/form-factory.service';
import {Subscription} from 'rxjs';

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
  enabled: boolean = false;

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService, private formFactory: FormFactoryService) {
  }

  ngOnDestroy() {
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.owner = s;
        this.form.get('step.alias.owner').setValue(s);
      }
    );
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        console.log('repo changed');

        this.repo = s;
        // this.initForm();
        this.form.get('step.alias.owner').setValue(this.owner);
        this.form.get('step.alias.repository').setValue(this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        console.log('site changed');
        this.initForm();
        this.enabled = true;

        this.form.get('step.alias.owner').setValue(this.owner);
        this.form.get('step.alias.repository').setValue(this.repo);
        this.form.get('step.alias.site').setValue(s);
      });
  }


  initForm() {
    this.enabled = false;
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
