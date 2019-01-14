import {FormControl, Validators} from '@angular/forms';

export class Step {
  type:  string;
  currentUser: string;
  alias: {
    owner: string;
    repo: string;
    repository: string;
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
