import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LoggerService} from '../logger.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  errorMessage: Subscription;
  okMessage: Subscription;
  message: string;
  error: boolean;

  constructor(private loggerSvc: LoggerService) {
  }

  ngOnInit() {
    this.errorMessage = this.loggerSvc.dirtyError.subscribe((data: string) => {
      this.message = data;
      this.error = true;
    });

    this.okMessage = this.loggerSvc.okMessage.subscribe((data: string) => {
      this.message = data;
      this.error = false;
    });
    this.message = '';
  }

  ngOnDestroy() {
    this.errorMessage.unsubscribe();
    this.okMessage.unsubscribe();
  }

  delete() {
    this.message = '';
  }
}
