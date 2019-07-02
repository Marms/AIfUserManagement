import {NgModule} from '@angular/core';
import {GroupCreateComponent} from './group-create/group-create.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {UserManagementService} from '../../shared/user-management.service';
import {FormFactoryService} from '../../shared/form-factory.service';
import {SharedsModule} from '../../shared/shareds.module';
import {GroupsRoutingModule} from './groups-routing.module';

@NgModule({
  declarations: [
    GroupCreateComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedsModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: [
    UserManagementService, FormFactoryService
  ]
})
export class GroupsModule {
}
