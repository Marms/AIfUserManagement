import {NgModule} from '@angular/core';
import {LogsComponent} from './logs.component';
import {CommonModule} from '@angular/common';
import {UserManagementService} from '../../shared/user-management.service';
import {LogsRoutingModule} from './logs-routing.module';

@NgModule({
  declarations: [LogsComponent],
  imports: [
    CommonModule,
    LogsRoutingModule
  ],
  providers: [UserManagementService]
})
export class LogsModules {

}
