import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserCreateComponent} from './user-create/user-create.component';
import {UserEditGroupComponent} from './user-edit-group/user-edit-group.component';
import {UserUpdatePasswordComponent} from './user-update-password/user-update-password.component';
import {BaseComponent} from '../../core/home/base.component';


const routes: Routes = [
  {
    path: 'user', component: BaseComponent, children: [
      {path: 'user-create', component: UserCreateComponent},
      {path: 'user-edit-group', component: UserEditGroupComponent},
      {path: 'user-update-password', component: UserUpdatePasswordComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
