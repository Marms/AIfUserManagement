import {Component, Input, OnInit} from '@angular/core';
import {StepResult} from '../../../services/shared/stepResult';
import {Log} from '../../../services/shared/log';
import {Step} from '../../../services/shared/step';

@Component({
  selector: 'app-log-list-item',
  templateUrl: './log-list-item.component.html',
  styleUrls: ['./log-list-item.component.css']
})
export class LogListItemComponent implements OnInit {

  @Input() logItem: Log;
  showResult: boolean;
  buttonLabel: string;
  globalStatus: string;

  header: string;
  message: string;

  constructor() {
  }

  ngOnInit() {
    this.buttonLabel = 'show';
    this.showResult = false;
    this.message = this.buildMessage(this.logItem.step);

    for (const result of this.logItem.results) {
      if (result.status === 'KO') {
        this.globalStatus = 'KO';
      }
    }
    console.log(this.header + ' ' + this.message);

  }

  buildMessage(step: Step): string {
    let message = '';
    if (step.type === 'createUser') {
      message = message.concat('Create user ' + step.user.username);
    } else if (step.type === 'updatePassword') {
      message = message.concat('Update password of user ' + step.user.username);
    } else if (step.type === 'addGroups') {
      message = message.concat('Add group to user ' + step.user.username);
    } else if (step.type === 'createGroup') {
      message = message.concat('Create group ' + step.group.groupname);
    } else {
      message = message.concat('?');
    }
    message = message
      .concat(' on ' + step.alias.repository)
      .concat(' / ' + step.alias.site);
    return message;
  }

  getStatusClasses(status: string) {
    return {
      'list-group-item-success': status === 'OK',
      'list-group-item-danger': status === 'KO'
    };
  }

  showDetail() {
    if (this.showResult) {
      this.showResult = false;
      this.buttonLabel = 'show';
    } else {
      this.showResult = true;
      this.buttonLabel = 'hide';
    }
  }

  clipboard() {
    navigator['clipboard'].writeText(JSON.stringify(this.logItem.results, null, 2));
  }
}
