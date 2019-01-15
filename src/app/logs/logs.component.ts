import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoggerService} from '../services/logger.service';
import {UserManagementService} from '../services/user-management.service';
import {Log} from '../services/shared/log';
import {Subscription} from 'rxjs';
import {Step} from '../services/shared/step';
import {StepResult} from '../services/shared/stepResult';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, OnDestroy {

  logString: string[] = [];
  logsSubscription: Subscription;

  constructor(private loggerSvc: LoggerService, private userSvc: UserManagementService) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {

    /// TODO mettre websocket
    this.userSvc.getLogs().subscribe(
      (data: string[]) => {
        this.logString = data;
        for (const logg of this.loggerSvc.getLogs()) {
          this.buildMessage(logg);
        }
        const textarea: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('logArray');
        textarea.value = this.logString.join('\n');
      }
    );
  }

  buildPrefix(log: Log) {
    const message = '[' + log.results[0].date + '] [INFO] [AFSUserManager] - \''
      + log.results[0].uuid + '\'' + ' id: \'' + log.step.currentUser + '\'';
    return message;
  }

  buildHeader(log: Log) {
    let message = this.buildPrefix(log);
    message += ' Repo: \'' + log.step.alias.repository + '\'';
    message += ' Site: \'' + log.step.alias.site + '\'';
    message += ' type demande \'' + log.step.type + '\'';
    return message;
  }

  buildMessage(log: Log): string {
    const message = this.buildPrefix(log);
    const temp: string[] = [];
    this.logString.push(this.buildHeader(log));
    for (const res of log.results) {
      this.logString.push(message + '' + ' IS: \'' + res.alias + '\' status \'' + res.status + '\' ' + res.message);
    }
    return message;
  }
}
