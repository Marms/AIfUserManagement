import {FormControl, Validators} from '@angular/forms';

export class Step {
  type:  string;
  alias: {
    owner: string;
    repo: string;
    site: string;
  };
  user: {
    username: string;
    groups: string[];
  };
  group: {
    groupname: string;
  };
}
