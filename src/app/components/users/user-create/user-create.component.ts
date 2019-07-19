import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserManagementService} from '../../../shared/user-management.service';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../../shared/form-factory.service';
import {Utils} from '../../../shared/utils';
import {Store} from '@ngrx/store';
import * as fromState from '../../../store/app.reducer';
import * as fromComponentAction from '../../store/components.actions';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  headerState: Subscription;
  showPassword = false;
  showForm = false;

  constructor(private formFactory: FormFactoryService,
              private store: Store<fromState.AppState>) {
  }

  ngOnDestroy() {
    this.headerState.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
    this.headerState = this.store.select('aifmcHeader').subscribe((action) => {
      if (action.setSite) {
        Utils.setSite(this.userForm, action.owner, action.repo, action.site);
        this.showForm = true;
      }
    });
  }

  // creation du formulaire
  initForm() {
    this.showForm = false;
    this.userForm = this.formFactory.createUserFormulaire();
  }

  onSubmit() {
    this.store.dispatch(new fromComponentAction.SaveUser(this.userForm.value));
    this.initForm();
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
