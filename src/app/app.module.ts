import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserSvcService} from './user-svc.service';
import {HttpModule} from '@angular/http';
import {AifMcSvcService} from './aif-mc-svc.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpModule
  ],
  providers: [UserSvcService, AifMcSvcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
