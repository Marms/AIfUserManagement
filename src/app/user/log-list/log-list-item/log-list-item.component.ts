import {Component, Input, OnInit} from '@angular/core';
import {StepResult} from '../../../services/shared/stepResult';
import {Log} from '../../../services/shared/log';

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

  constructor() {
  }

  ngOnInit() {
    console.log(this.logItem);
    this.buttonLabel = 'show';
    this.showResult = false;
    for (const result of this.logItem.results) {
      if (result.status === 'KO') {
        this.globalStatus = 'KO';
      }
    }
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

}
