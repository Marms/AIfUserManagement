import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserManagementService} from '../../services/user-management.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, OnDestroy {

  logString: string[] = [];

  constructor(private userSvc: UserManagementService) {
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
