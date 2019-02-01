import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class LoggerService {
  dirtyError: Subject<string> = new Subject<string>();

  sendErrorMessage(error) {
    this.dirtyError.next('An error was happened: ' + error.toString());
  }
  sendOKmessage(messaeg) {
    this.dirtyError.next(messaeg);
  }
}
