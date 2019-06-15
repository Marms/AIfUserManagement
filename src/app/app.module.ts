import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserManagementService} from './services/user-management.service';
import {AifmcService} from './services/aifmc.service';
import { UserEditGroupComponent } from './components/user-edit-group/user-edit-group.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { HeaderComponent } from './header/header.component';
import { BaseComponent } from './components/base.component';
import {AppRoutingModule} from './app-routing.module';
import {UserUpdatePasswordComponent} from './components/user-update-password/user-update-password.component';
import { AifmcHeaderComponent } from './components/shared/form-header/aifmc-header.component';
import {LoaderService} from './services/loader.service';
import { GroupCreateComponent } from './components/group-create/group-create.component';
import {LoggerService} from './services/logger.service';
import { LogsComponent } from './components/logs/logs.component';
import { MessageComponent } from './components/shared/message/message.component';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {HttpClientModule} from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    UserEditGroupComponent,
    UserCreateComponent,
    UserUpdatePasswordComponent,
    HeaderComponent,
    BaseComponent,
    AifmcHeaderComponent,
    GroupCreateComponent,
    LogsComponent,
    MessageComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot()
  ],
  providers: [UserManagementService, AifmcService, LoaderService, LoggerService, BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
