import {FormGroup} from '@angular/forms';

export class Utils {

  static setOwner(form: FormGroup, owner: string) {
    form.get('step.alias.owner').setValue(owner);
  }

  static setRepo(form: FormGroup, owner: string, repo: string) {
    form.get('step.alias.owner').setValue(owner);
    form.get('step.alias.repository').setValue(repo);
  }

  static setSite(form: FormGroup, owner: string, repo: string, site: string) {
    form.get('step.alias.owner').setValue(owner);
    form.get('step.alias.repository').setValue(repo);
    form.get('step.alias.site').setValue(site);

  }
}
