import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AifmcService} from '../../services/aifmc.service';
import {Subscription} from 'rxjs/Subscription';
import {AifmcHeaderComponent} from '../form-header/aifmc-header.component';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  repo: string;
  repoChanged: Subscription;
  siteChanged: Subscription;


  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService) {
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
    this.userForm = new FormGroup({
      'step': new FormGroup({
        'type': new FormControl('createUser'),
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

  onSubmit() {
    this.userSvc.saveUser(this.userForm.value);
    this.userForm.reset();
  }
}
