import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserManagementService} from '../../services/user-management.service';
import {Log} from '../../services/shared/log';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements OnInit , OnDestroy{

  logs: Log[] = [];
  logsSubscription: Subscription;
  constructor(private userSvc: UserManagementService) { }

  ngOnInit() {
    this.logs = this.userSvc.getLogs();
    this.logsSubscription = this.userSvc.logChanged.subscribe(
      (data: Log[]) => {
          this.logs = data;
      }
    );
  }

  ngOnDestroy() {
    this.logsSubscription.unsubscribe();
  }
}
