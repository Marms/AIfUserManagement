import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../services/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {AifmcService} from '../../services/aifmc.service';
import {UserItem} from '../../services/shared/userItem';
import {Subscription} from 'rxjs';
import {FormFactoryService} from '../../services/form-factory.service';
import {LoggerService} from '../../services/logger.service';
import {Step} from '../../services/shared/step';
import {Utils} from '../shared/utils';

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html'
})
export class UserEditGroupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  users: UserItem[];
  groups: UserItem[];
  selectedUser: UserItem;

  repo: string;
  owner: string;
  site: string;
  selectedGroup: string;

  showForm: boolean;
  disableUserOption: boolean;
  showGroupHeader: boolean;
  disableButton: boolean;

  ownerChanged: Subscription;
  repoChanged: Subscription;
  siteChanged: Subscription;
  stepSubmited: Subscription;

  constructor(private  userSvc: UserManagementService,
              private aifSvc: AifmcService,
              private formFactory: FormFactoryService,
              private loggerSvc: LoggerService) {
  }

  ngOnDestroy() {
    this.ownerChanged.unsubscribe();
    this.repoChanged.unsubscribe();
    this.stepSubmited.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {

    this.initForm();
    this.initVar();

    this.ownerChanged = this.aifSvc.ownerSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.owner = s;
        Utils.setOwner(this.userForm, this.owner);
      }
    );

    this.repoChanged = this.aifSvc.repoSubject.subscribe(
      (s: string) => {
        this.repo = s;
        this.initForm();
        Utils.setRepo(this.userForm, this.owner, this.repo);
      },
    );

    this.siteChanged = this.aifSvc.siteSubject.subscribe(
      (s: string) => {
        this.initForm();
        this.showForm = true;
        this.disableUserOption = false;
        this.showGroupHeader = false;
        this.site = s;
        Utils.setSite(this.userForm, this.owner, this.repo, this.site);

        this.userSvc.getUser(this.repo, s).subscribe(
          (data: any) => {

            this.users = data.users;
            this.selectedUser = new UserItem();
          },
          error1 => this.userSvc.handleError(error1)
        );

        this.userSvc.getGroups(this.repo, s).subscribe(
          (d: any) => {
            this.groups = d.groups;
          },
          error1 => this.userSvc.handleError(error1)
        );

      });

    this.stepSubmited = this.userSvc.stepSubmited.subscribe(() => {
      this.disableUserOption = false;
    });
  }

  initForm() {
    this.showForm = false;
    this.userForm = this.formFactory.userEditFormulaire();
  }

  initVar() {
    this.disableButton = true;
    this.showForm = false;
    this.selectedGroup = '_DONT_ADD_';
    this.showGroupHeader = false;
    this.selectedUser = new UserItem();
    this.selectedUser.membership = [];
    this.disableUserOption = false;
    this.removeAllGroup();
    this.userForm.reset();
  }

  userSelected(username: string) {
    this.showGroupHeader = true;
    this.resetSelectGroup();
    this.disableUserOption = true;
    this.disableButton = true;
    this.removeAllGroup();
    this.addAllMemberShipToGroups(username);
  }

  private addAllMemberShipToGroups(username: string) {
    for (const user of this.users) {
      if (username === user.name) {
        this.selectedUser = user;
        for (const group of user.membership) {
          const control = new FormControl();
          control.patchValue(group);
          control.setValidators(Validators.required);
          (<FormArray> this.userForm.get('step.user.groups')).push(control);
        }
      }
    }
  }

  removeAllGroup() {
    const array = <FormArray> this.userForm.get('step.user.groups');
    if (!this.isNullArray(array)) {
      while (array.length !== 0) {
        array.removeAt(0);
      }
    }
    const deletedArray = <FormArray> this.userForm.get('step.user.deletedGroups');
    if (!this.isNullArray(deletedArray)) {
      while (deletedArray.length !== 0) {
        deletedArray.removeAt(0);
      }
    }
  }

  isNullArray(array) {
    return array === undefined || array === null || array.length === 0;
  }

  onSubmit() {
    const value = this.cleanDeletedGroup(this.userForm.value);
    this.userSvc.saveUser(value);
    this.initVar();
  }

  /**
   * Si un group a été supprimé puis rajouté il est présent dans les deux listes (groups, deletedGroups)
   */
  private cleanDeletedGroup(value) {
    const res: Step = value.step;
    if (null !== res.user.deletedGroups) { // gestion cas : group supprime puis rajoute
      res.user.deletedGroups = res.user.deletedGroups.filter(
        s => {
          const arr = res.user.groups.find(g => g === s);
          return undefined === arr;
        }
      );
    }
    return value;
  }

  getGroups(): AbstractControl[] { // impossible d effectuer cette action dans le template
    return (<FormArray>this.userForm.get('step.user.groups')).controls;
  }

  groupSelected(group: string) {
    this.selectedGroup = group;
  }

  addOneGroup() {
    if (this.selectedGroup !== '_DONT_ADD_') {
      this.disableButton = false;
      const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
      array.push(new FormControl(this.selectedGroup, Validators.required));
      this.selectedUser.membership.push(this.selectedGroup);
      this.resetSelectGroup();
    }
  }

  resetSelectGroup() {
    const selectElement: HTMLSelectElement = (<HTMLSelectElement> document.getElementById('selectGroup'));
    if (null !== selectElement) {
      selectElement.selectedIndex = 0;
    }
    this.selectedGroup = '_DONT_ADD_';
  }

  addOneDeletedGroup(index: number) {
    this.disableButton = false;
    const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
    const deletedArray: FormArray = (<FormArray>this.userForm.get('step.user.deletedGroups'));
    deletedArray.push(array.controls[index]);

    array.removeAt(index);
    this.selectedUser.membership.splice(index, 1);
  }

  /***
   * Ne pas afficher les groups déjà contenu dans l'utilisateur
   */
  getFilteredGroup(): string[] {
    const array2 = this.groups.filter(group => {
      return undefined === this.selectedUser.membership.find(member => member === group.name);
    });
    return array2.map(item => item.name);
  }


}
