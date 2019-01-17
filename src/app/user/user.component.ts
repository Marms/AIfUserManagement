import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../services/loader.service';
import {Subscription} from 'rxjs/Subscription';
import {UserManagementService} from '../services/user-management.service';
import {AifmcHeaderComponent} from './form-header/aifmc-header.component';
import {AifmcService} from '../services/aifmc.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  constructor(private userSvc: UserManagementService, private aifSvc: AifmcService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
