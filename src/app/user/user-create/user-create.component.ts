import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AifmcService} from '../../services/aifmc.service';
import {Subscription} from 'rxjs/Subscription';
import {AifmcHeaderComponent} from '../form-header/aifmc-header.component';
import {FormFactoryService} from '../../services/form-factory.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  repo: string;
  repoChanged: Subscription;
  siteChanged: Subscription;


  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService,
              private formFactory: FormFactoryService) {
  }

  ngOnDestroy() {
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        this.userForm.get('step.alias.repository').setValue(this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.userForm.get('step.alias.repository').setValue(this.repo);
        this.userForm.get('step.alias.site').setValue(s);
      });
  }

  // creation du formulaire
  initForm() {
    this.userForm = this.formFactory.createUserFormulaire();
  }

  onSubmit() {
    this.userSvc.saveUser(this.userForm.value);
    this.userForm.reset();
  }
}
