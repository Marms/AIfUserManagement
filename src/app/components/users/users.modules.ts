import {NgModule} from '@angular/core';
import {UserEditGroupComponent} from './user-edit-group/user-edit-group.component';
import {UserCreateComponent} from './user-create/user-create.component';
import {UserUpdatePasswordComponent} from './user-update-password/user-update-password.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UserManagementService} from '../../shared/user-management.service';
import {LoaderService} from '../../shared/loader.service';
import {LoggerService} from '../../shared/logger.service';
import {BsModalService} from 'ngx-bootstrap';
import {MessageComponent} from '../../shared/message/message.component';
import {FormFactoryService} from '../../shared/form-factory.service';
import {SharedsModule} from '../../shared/shareds.module';
import {UsersRoutingModule} from './users-routing.module';

@NgModule({
  declarations: [
    UserEditGroupComponent,
    UserCreateComponent,
    UserUpdatePasswordComponent,
    MessageComponent
  ],
  imports: [
    UsersRoutingModule,
    CommonModule,
    SharedsModule,
    ReactiveFormsModule,
  ],
  exports: [],
  providers: [UserManagementService, LoaderService, FormFactoryService, LoggerService, BsModalService]
})
export class UsersModules {
}
