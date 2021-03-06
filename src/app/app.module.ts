import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserManagementService} from './services/user-management.service';
import {HttpModule} from '@angular/http';
import {AifmcService} from './services/aifmc.service';
import { UserEditGroupComponent } from './user/user-edit-group/user-edit-group.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import {AppRoutingModule} from './app-routing.module';
import {UserUpdatePasswordComponent} from './user/user-update-password/user-update-password.component';
import { AifmcHeaderComponent } from './user/form-header/aifmc-header.component';
import {LoaderService} from './services/loader.service';
import { GroupCreateComponent } from './user/group-create/group-create.component';
import {LoggerService} from './services/logger.service';
import { LogsComponent } from './logs/logs.component';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditGroupComponent,
    UserCreateComponent,
    UserUpdatePasswordComponent,
    HeaderComponent,
    UserComponent,
    AifmcHeaderComponent,
    GroupCreateComponent,
    LogsComponent,
    MessageComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [UserManagementService, AifmcService, LoaderService, LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
