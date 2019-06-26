import {Component, OnInit} from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  owners: string[];
  showLoader;

  constructor() {
    setTheme('bs4');
  }

  ngOnInit() {
    this.owners = [];
    this.showLoader = false;
  }

}
