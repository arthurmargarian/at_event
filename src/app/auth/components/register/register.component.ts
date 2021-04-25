import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../infratructure/validators/email-validator';
import { AuthApiService } from '../../auth-service.service';
import { UserModel } from '../../../infratructure/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean;
  public isPassMatch: boolean;

  constructor(private titleService: Title,
              private authApiService: AuthApiService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.titleService.setTitle('Sign Up');
    this.initForm();
    this.initFormWatchers();
  }

  private initForm() {
    this.form = this.fb.group({
      email: [null, [EmailValidator, Validators.required]],
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      passwordConfirm: [null, [Validators.required]],
    });
  }

  private initFormWatchers(): void {
    this.passConfirmWatcher();
    this.passwordWatcher();
    this.emailWatcher();
  }

  private passConfirmWatcher() {
    this.form.get('passwordConfirm').valueChanges
      .subscribe(val => {
        if (val) {
          this.checkPassMatch(val);
        }
      });
  }

  private passwordWatcher(): void {
    this.form.get('password').valueChanges
      .subscribe(val => {
        if (val) {
          this.checkPassMatch(val);
        }
      });
  }

  private emailWatcher() {
    this.form.get('email').valueChanges
      .subscribe(val => {
        if (val && this.form.get('email').valid) {
          this.checkEmail(val);
        }
      });
  }

  private checkEmail(userEmail: string): void {
    this.authApiService.findUserByEmail(userEmail)
      .subscribe(res => {
        if (res.model) {
          this.form.get('email').setErrors({emailExist: true});
        } else {
          this.form.get('email').setErrors(null);
        }
      });
  }

  private checkPassMatch(pass: string): void {
    const passControl = this.form.get('password');
    if (passControl.value && passControl.valid) {
      if (passControl.value !== pass) {
        this.form.get('passwordConfirm').setErrors({isNotMatch: true});
      } else {
        this.form.get('passwordConfirm').setErrors(null);
      }
    }
  }

  public signUpSubmit(): void {
    if (this.form.valid) {
      const model = new UserModel(0);
      const values = this.form.value;
      model.firstName = values.firstName;
      model.lastName = values.lastName;
      model.email = values.email;
      model.password = values.password;
      this.addUser(model);
    }
  }

  private addUser(newUser: UserModel): void {
    this.authApiService.signUp(newUser)
      .subscribe(res => {
      console.log(res);
    });
  }
}
