import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../infratructure/validators/email-validator';
import { AuthService } from '../../auth-service.service';
import { Title } from '@angular/platform-browser';
import { LoginStatusEnum } from '../../../infratructure/enums/login-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public requested: boolean;
  public passwordError: boolean;
  public emailError: boolean;
  public isLoading: boolean;

  constructor(private fb: FormBuilder,
              private router: Router,
              private titleService: Title,
              private authService: AuthService) {
  }

  public form: FormGroup;
  public submitted: boolean;

  ngOnInit() {
    this.titleService.setTitle('Sign In');
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, EmailValidator.validate]],
      password: [null, [Validators.required]]
    });
    this.emailWatcher();
    this.passwordWatcher();
  }

  private emailWatcher() {
    this.form.get('email').valueChanges
      .subscribe(() => {
        if (this.requested && this.emailError) {
          this.emailError = false;
        }
      });
  }

  private passwordWatcher() {
    this.form.get('password').valueChanges
      .subscribe(() => {
        if (this.requested && this.passwordError) {
          this.passwordError = false;
        }
      });
  }

  public signInSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      this.emailError = false;
      this.passwordError = false;
      this.authService.signIn(this.form.value)
        .subscribe(res => {
          this.requested = true;
          switch (res.status) {
            case LoginStatusEnum.Success:
              this.setUserSettings(res);
              break;
            case LoginStatusEnum.UserNotFound:
              this.emailError = true;
              break;
            case LoginStatusEnum.InvalidPassword:
              this.passwordError = true;
              break;
          }
          this.isLoading = false;
        });
    }
  }

  private setUserSettings(res): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('loggedUser', JSON.stringify(res.user));
    this.router.navigate(['/']);
  }
}
