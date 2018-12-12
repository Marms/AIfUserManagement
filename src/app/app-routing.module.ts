import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UserComponent} from './user/user.component';
import {UserCreateComponent} from './user/user-create/user-create.component';
import {UserEditGroupComponent} from './user/user-edit-group/user-edit-group.component';
import {UserUpdatePasswordComponent} from './user/user-update-password/user-update-password.component';

const routes: Routes = [
  {
    path: 'user', component: UserComponent, children: [
      {path: 'user-create', component: UserCreateComponent},
      {path: 'user-edit-group', component: UserEditGroupComponent },
      {path: 'user-update-password', component: UserUpdatePasswordComponent },
      {path: '**', component: UserCreateComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
