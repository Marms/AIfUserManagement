import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BaseComponent} from './core/home/base.component';
import {UserCreateComponent} from './components/users/user-create/user-create.component';
import {UserEditGroupComponent} from './components/users/user-edit-group/user-edit-group.component';
import {UserUpdatePasswordComponent} from './components/users/user-update-password/user-update-password.component';
import {GroupCreateComponent} from './components/groups/group-create/group-create.component';
import {LogsComponent} from './components/logs/logs.component';

const routes: Routes = [
  { path: 'home', component: BaseComponent}
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
