import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserManagementService} from '../../../shared/user-management.service';
import {AbstractControl} from '@angular/forms/src/model';
import {UserItem} from '../../../shared/pojo/userItem';
import {Observable, Subscription} from 'rxjs';
import {FormFactoryService} from '../../../shared/form-factory.service';
import {LoggerService} from '../../../shared/logger.service';
import {Step} from '../../../shared/pojo/step';
import {Utils} from '../../../shared/utils';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as fromComponentActions from '../../store/components.actions';
import * as fromComponentReducer from '../../store/components.reducer';


// supprimer uniquement des groupes ne permet pas de sauvegarder
// en changeant le group on garde en mémoire les actions passée
// les groupes ne sont pas mis dans le deletedGroup.

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html'
})
export class UserEditGroupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  componentState$: Observable<fromComponentReducer.State>;
  selectedUser: UserItem;

  selectedGroup: string;

  showForm: boolean;
  disableUserOption: boolean;
  showGroupHeader: boolean;
  disableButton: boolean;

  componentActions: Subscription;
  selectUserAction: Subscription;
  siteChanged: Subscription;

  constructor(private  userSvc: UserManagementService,
              private formFactory: FormFactoryService,
              private loggerSvc: LoggerService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnDestroy() {
    this.componentActions.unsubscribe();
    this.siteChanged.unsubscribe();
  }

  ngOnInit() {

    this.initForm();
    this.initVar();

    this.siteChanged = this.store.select('aifmcHeader').subscribe(
      (action) => {

        if (action.setSite) {
          Utils.setSite(this.userForm, action.owner, action.repo, action.site);
          this.initForm();
          this.store.dispatch(new fromComponentActions.GetUsers({header: {owner: action.owner, repo: action.repo, site: action.site}}));
          this.store.dispatch(new fromComponentActions.GetGroups({header: {owner: action.owner, repo: action.repo, site: action.site}}));
          this.disableUserOption = false;
          this.showGroupHeader = false;

        } else {
          this.store.dispatch(new fromComponentActions.ResetUsers());
        }
        this.initVar();

      }
    );

    this.selectUserAction = this.store.select('components').subscribe((action) => {
      if ( action.actionName === fromComponentActions.SELECT_USER) {
        this.selectedUser = action.user;
        this.showGroupHeader = true;
        this.resetSelectGroup();
        this.disableUserOption = true;
        this.disableButton = true;
        this.removeAllGroup();
        this.addAllMemberShipToGroups('');
        this.addAllDeletedGroup(action.deletedGroup);
      }
    });

    this.componentActions = this.store.select('components').subscribe((action) => {
      if (action.actionName === fromComponentActions.ADD_GROUP ||  action.actionName === fromComponentActions.REMOVE_GROUP) {
        this.resetSelectGroup();
        this.disableUserOption = true;
        this.disableButton = false;
        this.removeAllGroup();
        // const nameArray = (action.actionName === fromComponentActions.ADD_GROUP) ? 'step.user.groups' : 'step.user.deletedGroups';
        this.addAllMemberShipToGroups('');
        this.addAllDeletedGroup(action.deletedGroup);
      }
    });


    this.componentState$ = this.store.select('components');

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
    this.store.dispatch(new fromComponentActions.SelectUser({username: username}));
  }

  private addAllMemberShipToGroups(username: string) {
    for (const group of this.selectedUser.membership) {
      this.pushToArray(group, 'step.user.groups');
    }
  }
  private addAllDeletedGroup(groups: string[]) {
    for (const group of groups) {
      this.pushToArray(group, 'step.user.deletedGroups');
    }
  }

  private pushToArray(group, name) {
    const control = new FormControl();
    control.patchValue(group);
    control.setValidators(Validators.required);
    (<FormArray>this.userForm.get(name)).push(control);
  }

  removeAllGroup() {
    const array = <FormArray>this.userForm.get('step.user.groups');
    if (!this.isNullArray(array)) {
      while (array.length !== 0) {
        array.removeAt(0);
      }
    }
    const deletedArray = <FormArray>this.userForm.get('step.user.deletedGroups');
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
    this.store.dispatch(new fromComponentActions.ResetUsers());
    this.store.dispatch(new fromComponentActions.ResetGroups());
    this.store.dispatch(new fromComponentActions.SaveUser(this.userForm.value));
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
    this.store.dispatch(new fromComponentActions.SelectGroup({groupname: group}));

  }

  addOneGroup() {
    this.store.dispatch(new fromComponentActions.AddGroup());
    this.disableButton = false;
    this.resetSelectGroup();
  }

  resetSelectGroup() {
    const selectElement: HTMLSelectElement = (<HTMLSelectElement>document.getElementById('selectGroup'));
    if (null !== selectElement) {
      selectElement.selectedIndex = 0;
    }
  }

  addOneDeletedGroup(index: number) {
    this.disableButton = false;
    const array: FormArray = (<FormArray>this.userForm.get('step.user.groups'));
    const deletedArray: FormArray = (<FormArray>this.userForm.get('step.user.deletedGroups'));
    deletedArray.push(array.controls[index]);
    this.store.dispatch(new fromComponentActions.RemoveGroup({groupname: array.controls[index].value}));
  }

  /***
   * Ne pas afficher les groups déjà contenu dans l'utilisateur
   */
  getFilteredGroup(groups: UserItem[]): string[] {
    const array2 = groups.filter(group => {
      return undefined === this.selectedUser.membership.find(member => member === group.name);
    });
    return array2.map(item => item.name);
  }
}
