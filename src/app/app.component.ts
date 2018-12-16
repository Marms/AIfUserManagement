import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from './services/user-management.service';
import {AifmcService} from './services/aifmc.service';
import {AbstractControl} from '@angular/forms/src/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  owners: string[];

  constructor(private  userSvc: UserManagementService, private aifSvc: AifmcService) {
  }

  ngOnInit() {
    this.owners = [];

    this.aifSvc.getOwners()
      .subscribe((data: any) => {
        this.owners = data.owners;
      });
  }



}
