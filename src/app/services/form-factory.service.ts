import {Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormFactoryService {

  currentUser: string;

  constructor() {
    this.currentUser = localStorage.getItem('current_user');
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
          'password': new FormControl(null, Validators.required),
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
          'groupname': new FormControl(null, Validators.required)
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
          'username': new FormControl(null, Validators.required),
          'password': new FormControl(null, Validators.required),
        })
      })
    });
    return userForm;
  }

  invalideName(control: FormControl) {
    if (control.value === 'Please select' || control.value === null, control.value === '') {
      console.log('vadi');
      return {'pleaseSelect': true};
    }
    return {'pleaseSelect': false};
    ;
  }

  isEmpty(res) {
    return null === res || res === '';
  }

}
