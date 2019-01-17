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

  constructor(private loggerSvc: LoggerService, private userSvc: UserManagementService) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    /// TODO mettre websocket
    this.userSvc.getLogs().subscribe(
      (data: string[]) => {
        this.logString = data;
        const textarea: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('logArray');
        textarea.value = this.logString.join('\n');
      }, error1 => this.userSvc.handleError(error1)
    );
  }
}
