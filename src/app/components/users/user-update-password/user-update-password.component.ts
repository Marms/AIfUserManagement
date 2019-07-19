import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserManagementService} from '../../../shared/user-management.service';
import {UserItem} from '../../../shared/pojo/userItem';
import {Observable, Subscription} from 'rxjs';
import {FormFactoryService} from '../../../shared/form-factory.service';
import {LoggerService} from '../../../shared/logger.service';
import {Utils} from '../../../shared/utils';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as fromComponentAction from '../../store/components.actions';
import * as fromComponentReducer from '../../store/components.reducer';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.css']
})
export class UserUpdatePasswordComponent implements OnInit, OnDestroy {

  userForm: FormGroup;

  aifmcState: Subscription;
  componentState: Observable<fromComponentReducer.State>;

  user: string;

  showForm: boolean;
  showPassword = false;
  showPleaseSelectOption: boolean;

  modalRef: BsModalRef;


  constructor(
    private formFactory: FormFactoryService,
    private  loggerSvc: LoggerService,
    private store: Store<fromApp.AppState>,
    private modalService: BsModalService) {
  }


  ngOnInit() {
    this.initForm();

    this.aifmcState = this.store.select('aifmcHeader').subscribe((action) => {
      if (action.setSite) {
        Utils.setSite(this.userForm, action.owner, action.repo, action.site);
        this.showForm = true;
        this.store.dispatch(new fromComponentAction.GetUsers({header: {owner: action.owner, repo: action.repo, site: action.site}}));
      } else {
        this.initVar();
        this.store.dispatch(new fromComponentAction.ResetUsers());
      }
    });

    this.componentState = this.store.select('components');

  }

  ngOnDestroy() {
    this.aifmcState.unsubscribe();
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
    this.store.dispatch(new fromComponentAction.SaveUser(this.userForm.value));
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
