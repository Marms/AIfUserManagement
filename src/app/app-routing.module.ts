import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BaseComponent} from './components/base.component';
import {UserCreateComponent} from './components/user-create/user-create.component';
import {UserEditGroupComponent} from './components/user-edit-group/user-edit-group.component';
import {UserUpdatePasswordComponent} from './components/user-update-password/user-update-password.component';
import {GroupCreateComponent} from './components/group-create/group-create.component';
import {LogsComponent} from './components/logs/logs.component';

const routes: Routes = [
  {
    path: 'group', component: GroupCreateComponent
  },
  {
    path: 'user', component: BaseComponent, children: [
      {path: 'user-create', component: UserCreateComponent},
      {path: 'user-edit-group', component: UserEditGroupComponent},
      {path: 'user-update-password', component: UserUpdatePasswordComponent},
      {path: '**', component: BaseComponent}
    ]
  },
  {path: 'logs', component: LogsComponent},
  {path: '**', component: BaseComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
