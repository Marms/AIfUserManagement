import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormFactoryService} from '../../../shared/form-factory.service';
import { Subscription} from 'rxjs';
import {Utils} from '../../../shared/utils';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as fromComponentAction from '../../store/components.actions';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit, OnDestroy {
  siteChanged: Subscription;

  form: FormGroup;
  showForm = false;

  constructor(private formFactory: FormFactoryService, private store: Store<fromApp.AppState>) {
  }

  ngOnDestroy() {
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
    this.siteChanged = this.store.select('aifmcHeader').subscribe((action) => {
      if (action.setSite) {
        Utils.setSite(this.form, action.owner, action.repo, action.site);
        this.showForm = true;
      }
    });
  }

  initForm() {
    this.showForm = false;
    this.form = this.formFactory.createGroupFormulaire();
  }

  onSubmit() {
    this.store.dispatch(new fromComponentAction.SaveGroup(this.form.value));
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
