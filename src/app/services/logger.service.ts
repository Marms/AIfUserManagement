import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Log} from './shared/log';
import {Subject} from 'rxjs';
import {UserManagementService} from './user-management.service';

@Injectable()
export class LoggerService {

  logChanged: Subject<Log[]> = new Subject<Log[]>();
  logs: Log[] = [];

  addLog(step: any, results: any) {
    const log = new Log();
    log.results = results;
    log.step = step.step;
    this.logs.push(log);
    this.logChanged.next(this.getLogs());
  }

  getLogs(): Log[] {
    return this.logs.slice();
  }

}
