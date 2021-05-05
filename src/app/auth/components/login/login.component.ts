import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'ng-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../infratructure/validators/email-validator';
import { AuthApiService } from '../../auth-service.service';
import { Title } from '@angular/platform-browser';
import { LoginStatusEnum } from '../../../infratructure/enums/login-status.enum';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../shared/services/settings.service';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserModel } from '../../../infratructure/models/user.model';
import { UserCredentialsInterface } from '../../../infratructure/interfaces/user-credentials.interface';

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
              private translateService: TranslateService,
              private titleService: Title,
              private settingsService: SettingsService,
              private socialAuthService: AuthService,
              private globalVarsService: GlobalVarsService,
              private authApiService: AuthApiService) {
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

  private setUserSettings(res): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('loggedUser', JSON.stringify(res.user));
    this.router.navigate(['/dashboard']);
    this.globalVarsService.isAuthenticated.next(true);
    this.getLanguage(res.user.id);
  }

  private registerUserFromSocial(res: SocialUser): void {
    const model = new UserModel(0);
    const names = res.name.split(' ');
    model.firstName = names[0];
    model.lastName = names[1];
    model.email = res.email;
    model.password = res.email;
    model.photoUrl = res.photoUrl;
    model.isSocial = true;
    this.addUser(model);
  }

  private getLanguage(userId: number): void {
    this.settingsService.getUserSettings(userId)
      .subscribe((res) => {
        if (res && res.model && res.model.language) {
          this.globalVarsService.currentLanguage.next(res.model.language);
        }
      });
  }

  public signInSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      this.emailError = false;
      this.passwordError = false;
      this.authApiService.signIn(this.form.value)
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

  public onFacebookLogin(): void {
    const providerId = FacebookLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(providerId)
      .then(res => {
        if (res) {
          this.authForUserFromSocial(res);
        } else {
          alert('Facebook Social failed');
        }
      });
  }

  public onGoogleLogin(): void {
    const providerId = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(providerId)
      .then(res => {
        if (res) {
          this.authForUserFromSocial(res);
        } else {
          alert('Google Social failed');
        }
      });
  }

  private addUser(model: UserModel): void {
    this.authApiService.signUp(model)
      .subscribe(res => {
        if (res.success) {
          const credentials = {
            email: model.email,
            password: model.password
          };
          this.singIn(credentials);
          alert('Social Register Success');
        } else {
          alert('Social Register Failed');
        }
      });
  }

  private singIn(credentials: UserCredentialsInterface): void {
    this.authApiService.signIn(credentials)
      .subscribe((res) => {
        if (res) {
          this.setUserSettings(res);
          alert('Login Success');
        } else {
          alert('Login Failed');
        }
      });
  }

  private authForUserFromSocial(res: SocialUser): void {
    this.authApiService.findUserByEmail(res.email)
      .subscribe(resp => {
        if (resp.model) {
          const credentials = {
            email: res.email,
            password: res.email
          };
          this.singIn(credentials);
        } else {
          this.registerUserFromSocial(res);
        }
      });

  }
}
