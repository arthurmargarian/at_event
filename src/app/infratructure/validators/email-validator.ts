import { AbstractControl } from '@angular/forms';

export class EmailValidator {

  public static validate(c: AbstractControl) {
    // tslint:disable-next-line:max-line-length
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (c.value) {
      return EMAIL_REGEXP.test(String(c.value).toLowerCase()) ? null : {email: true};
    }
  }
}
