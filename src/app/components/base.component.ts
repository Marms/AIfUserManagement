import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../services/loader.service';
import {Subscription} from 'rxjs/Subscription';
import {UserManagementService} from '../services/user-management.service';
import {AifmcHeaderComponent} from './shared/form-header/aifmc-header.component';
import {AifmcService} from '../services/aifmc.service';

@Component({
  selector: 'app-user',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
