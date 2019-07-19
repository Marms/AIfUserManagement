import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {UsersModules} from './components/users/users.modules';
import {GroupsModule} from './components/groups/groups.module';
import {SharedsModule} from './shared/shareds.module';
import {LogsModules} from './components/logs/logs.modules';
import {StoreModule} from '@ngrx/store';
import {reducers} from './store/app.reducer';
import {AifmcHeaderEffect} from './shared/form-header/store/aifmc-header.effect';
import {EffectsModule} from '@ngrx/effects';
import {ComponentsEffects} from './components/store/components.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    GroupsModule,
    UsersModules,
    SharedsModule,
    LogsModules,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AifmcHeaderEffect, ComponentsEffects]),

  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
