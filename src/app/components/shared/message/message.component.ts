import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit , OnDestroy {
  errorMessage: Subscription;
  message: string;

  constructor(private loggerSvc: LoggerService) {
  }

  ngOnInit() {
    this.errorMessage = this.loggerSvc.dirtyError.subscribe((data: string) => {
      this.message = data;
    });
    this.message = '';
  }

  ngOnDestroy() {
    this.errorMessage.unsubscribe();
  }

  delete() {
    this.message = '';
  }
}
