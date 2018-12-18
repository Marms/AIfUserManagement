import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../services/loader.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {


  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
