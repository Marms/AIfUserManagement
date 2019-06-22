import {NgModule} from '@angular/core';
import {BaseComponent} from './home/base.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from '../app-routing.module';

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
  providers: []
})
export class CoreModule {

}
