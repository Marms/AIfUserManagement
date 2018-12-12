import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserSvcService} from './services/user-svc.service';
import {HttpModule} from '@angular/http';
import {AifMcSvcService} from './services/aif-mc-svc.service';
import { UserEditGroupComponent } from './user/user-edit-group/user-edit-group.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import {AppRoutingModule} from './app-routing.module';
import {UserUpdatePasswordComponent} from './user/user-update-password/user-update-password.component';
import { AifmcHeaderComponent } from './user/form-header/aifmc-header.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditGroupComponent,
    UserCreateComponent,
    UserUpdatePasswordComponent,
    HeaderComponent,
    UserComponent,
    AifmcHeaderComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [UserSvcService, AifMcSvcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
