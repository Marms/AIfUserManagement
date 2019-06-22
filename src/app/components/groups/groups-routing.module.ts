import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupCreateComponent} from './group-create/group-create.component';


const routes: Routes = [
  {
    path: 'group', component: GroupCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {
}
