import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Log} from './shared/log';
import {Subject} from 'rxjs';
import {UserManagementService} from './user-management.service';

@Injectable()
export class LoggerService {
  dirtyError: Subject<string> = new Subject<string>();
  logChanged: Subject<Log[]> = new Subject<Log[]>();
  logs: Log[] = [];

  /** Add log n'est plus utilisé */
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

  sendErrorMessage(error) {
    this.dirtyError.next('An error was happened: ' + error.toString());
  }
  sendOKmessage(messaeg) {
    this.dirtyError.next(messaeg);
  }
}
