import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserManagementService} from '../../services/user-management.service';
import {Log} from '../../services/shared/log';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements OnInit , OnDestroy{

  logs: Log[] = [];
  logsSubscription: Subscription;
  constructor(private loggerSvc: LoggerService, private userSvc: UserManagementService) { }

  ngOnInit() {
    this.logs = this.loggerSvc.getLogs();
    this.logsSubscription = this.loggerSvc.logChanged.subscribe(
      (data: Log[]) => {
          this.logs = data.reverse();
      }
    );
  }
  ngOnDestroy() {
    this.logsSubscription.unsubscribe();
  }
}
