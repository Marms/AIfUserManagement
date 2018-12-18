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

  repoChanged: Subscription;
  siteChanged: Subscription;
  form: FormGroup;
  repo: string;


  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService, private formFactory: FormFactoryService) {
  }

  ngOnDestroy() {
    this.repoChanged.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        console.log('repo changed')

        this.repo = s;
        this.initForm();
        this.form.get('step.alias.repository').setValue(this.repo);

      });

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        console.log('site changed')
        this.initForm();
        this.form.get('step.alias.repository').setValue(this.repo);
        this.form.get('step.alias.site').setValue(s);
      });
  }


  initForm() {
    this.form = this.formFactory.createGroupFormulaire();
  }

  onSubmit() {
    console.log(this.form.value);
    this.userSvc.saveGroup(this.form.value);
  }
}
