import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserSvcService} from '../../services/user-svc.service';
import {AifMcSvcService} from '../../services/aif-mc-svc.service';
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


  constructor(private  userSvc: UserSvcService, private aifSvc: AifMcSvcService) {
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
        this.userForm.get('step.alias.repo').setValue(this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.userForm.get('step.alias.repo').setValue(this.repo);
        this.userForm.get('step.alias.site').setValue(s);
      });
  }

  // creation du formulaire
  initForm() {
    this.userForm = new FormGroup({
      'step': new FormGroup({
        'type': new FormControl('createUser'),
        'alias': new FormGroup({
          'repo': new FormControl('', Validators.required),
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
    console.log(this.userForm.value);
    this.userForm.reset();
  }
}
