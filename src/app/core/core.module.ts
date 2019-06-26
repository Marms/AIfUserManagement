import {NgModule} from '@angular/core';
import {BaseComponent} from './home/base.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from '../app-routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RequestInterceptor} from './request-interceptor';

@NgModule({
declarations: [
  BaseComponent,
  HeaderComponent
],
  imports: [
    AppRoutingModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true}
  ]
})
export class CoreModule {

}
