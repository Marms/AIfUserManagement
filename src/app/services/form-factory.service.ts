import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormFactoryService {

  currentUser: string;

  constructor() {
    this.currentUser = environment.currentUser;
    if (null !== this.currentUser) {
      this.currentUser = this.currentUser.replace(new RegExp('"', 'g'), '');
    }
  }

  updatePasswordFormulaire(): FormGroup {
    return new FormGroup({
      'step': new FormGroup({
        'currentUser': new FormControl(this.currentUser),
        'type': new FormControl('updatePassword'),
        'alias': new FormGroup({
          'owner': new FormControl('', Validators.required),
          'repository': new FormControl('', Validators.required),
          'site': new FormControl('', Validators.required)
        }),
        'user': new FormGroup({
          'username': new FormControl(null, [Validators.required]),
          'password': new FormControl(null, [Validators.required, this.whitespace]),
        })
      })
    });
  }

  userEditFormulaire(): FormGroup {
    const form = new FormGroup
    ({
      'step': new FormGroup({
        'currentUser': new FormControl(this.currentUser),
        'type': new FormControl('addGroups'),
        'alias': new FormGroup({
          'owner': new FormControl(),
          'repository': new FormControl('', Validators.required),
          'site': new FormControl('', Validators.required)
        }),
        'user': new FormGroup({
          'username': new FormControl(null, Validators.required),
          'groups': new FormArray([]),
          'deletedGroups': new FormArray([])
        })
      })
    });
    return form;
  }

  createGroupFormulaire(): FormGroup {
    const form = new FormGroup({
      'step': new FormGroup({
        'currentUser': new FormControl(this.currentUser),
        'type': new FormControl('createGroup'),
        'alias': new FormGroup({
          'owner': new FormControl('', Validators.required),
          'repository': new FormControl('', Validators.required),
          'site': new FormControl('', Validators.required)
        }),
        'group': new FormGroup({
          'groupname': new FormControl(null, [Validators.required, this.whitespace])
        })
      })
    });
    return form;
  }

  createUserFormulaire(): FormGroup {
    const userForm = new FormGroup({
      'step': new FormGroup({
        'currentUser': new FormControl(this.currentUser),
        'type': new FormControl('createUser'),
        'alias': new FormGroup({
          'owner': new FormControl('', Validators.required),
          'repository': new FormControl('', [Validators.required]),
          'site': new FormControl('', [Validators.required])
        }),
        'user': new FormGroup({
          'username': new FormControl('', [Validators.required, this.minMax, this.whitespace]),
          'password': new FormControl(null, [Validators.required, this.whitespace]),
        })
      })
    });
    return userForm;
  }

  //  Validators.pattern('/^[a-zA-Z]+$/')]]
  minMax(control: FormControl) {
    if ((null != control.value) && (control.value.toString().length) > 20) {
      return {'maxLength': true};
    }
    return null;
  }


  //  Validators.pattern('/^[a-zA-Z]+$/')]]
  whitespace(control: FormControl) {
    if ((null !== control.value) && (control.value.toString().match('.*[\' \'].*'))) {
      return {'whitespace': true};
    }
    return null;
  }

}
