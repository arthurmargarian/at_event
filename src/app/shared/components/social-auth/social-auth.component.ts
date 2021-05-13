import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'ng-social-login';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../auth/auth-service.service';
import { UserCredentialsInterface } from '../../../infratructure/interfaces/user-credentials.interface';
import { ToastrService } from 'ngx-toastr';
import { GlobalVarsService } from '../../../global-vars.service';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../../infratructure/models/user.model';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.scss']
})
export class SocialAuthComponent implements OnInit {
  @Output() hideModal: EventEmitter<any> = new EventEmitter();
  public atEventPhotoUrl = 'assets/images/ae-icon.ico';

  constructor(private router: Router,
              private toastr: ToastrService,
              private authApiService: AuthApiService,
              private socialAuthService: AuthService,
              private globalVarsService: GlobalVarsService,
              private settingsService: SettingsService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
  }

  public onAtEventLogin(): void {
    this.hideModal.emit();
    this.router.navigate(['sign-in']);
  }

  public changeAtEventPhoto(isHover: boolean): void {
    this.atEventPhotoUrl = isHover ? 'assets/images/ae-white.png' : 'assets/images/ae-icon.png';
  }

  public onFacebookLogin(): void {
    this.hideModal.emit();
    const providerId = FacebookLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(providerId)
      .then(res => {
        if (res) {
          this.authForUserFromSocial(res);
        }
      });
  }

  public onGoogleLogin(): void {
    this.hideModal.emit();
    const providerId = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(providerId)
      .then(res => {
        if (res) {
          this.authForUserFromSocial(res);
        }
      });
  }

  private authForUserFromSocial(res: SocialUser): void {
    this.authApiService.checkByEmail(res.email)
      .subscribe(resp => {
        if (resp.model) {
          const credentials = {
            email: res.email,
            password: res.email
          };
          this.singIn(credentials, true);
        } else {
          this.registerUserFromSocial(res);
        }
      });
  }

  private singIn(credentials: UserCredentialsInterface, showNotify): void {
    this.authApiService.signIn(credentials)
      .subscribe((res) => {
        if (res) {
          this.setUserSettings(res);
          if (showNotify) {
            this.showNotificationMessage('NOTIFY_MESSAGES.sign_in');
          }
        }
      });
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

  private addUser(model: UserInterface): void {
    this.authApiService.signUp(model)
      .subscribe(res => {
        if (res.success) {
          const credentials = {
            email: model.email,
            password: model.password
          };
          this.showNotificationMessage('NOTIFY_MESSAGES.sign_up');
          this.singIn(credentials, false);
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

  private getLanguage(userId: number): void {
    this.settingsService.getUserSettings(userId)
      .subscribe((res) => {
        if (res && res.model && res.model.language) {
          this.globalVarsService.currentLanguage.next(res.model.language);
        }
      });
  }

  private showNotificationMessage(key: string): void {
    this.translateService.get(key)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }

}
