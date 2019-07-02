import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserManagementService} from './user-management.service';
import {LoaderService} from './loader.service';
import {LoggerService} from './logger.service';
import {AifmcHeaderComponent} from './form-header/aifmc-header.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [AifmcHeaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
    // ,EffectsModule.forFeature([AifmcHeaderEffect])

  ],
  exports: [CommonModule, AifmcHeaderComponent],
  providers: [UserManagementService, LoaderService, LoggerService]
})
export class SharedsModule {
}
