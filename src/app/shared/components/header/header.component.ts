import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageEnum } from '../../../infratructure/enums/language.enum';
import { Languages } from '../../../infratructure/constants/language.const';
import { LanguageModel } from '../../../infratructure/models/language.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthApiService } from '../../../auth/auth-service.service';
import { SettingsService } from '../../services/settings.service';
import { UserModel } from '../../../infratructure/models/user.model';
import { UserSettingModel } from '../../../infratructure/models/user-setting.model';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GlobalVarsService } from '../../../global-vars.service';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'ng-social-login';
import { UserCredentialsInterface } from '../../../infratructure/interfaces/user-credentials.interface';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('signOutModal') public signOutModal: ModalDirective;
  @ViewChild('signInModal') public signInModal: ModalDirective;

  public languageForm: FormGroup;
  public languages: LanguageModel[];
  public currentUser: UserModel;
  private ngDestroy = new Subject();
  public isAuth: boolean;
  private currentTooltip: NgbTooltip;
  public atEventPhotoUrl = 'assets/images/ae-icon.ico';
  public defaultProfilePic = 'assets/images//default-profile-pic.png';

  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              public authApiService: AuthApiService,
              private socialAuthService: AuthService,
              private globalVarsService: GlobalVarsService,
              private settingsService: SettingsService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.initLanguageForm();
    this.languages = Languages;
    this.checkInitialAuth();
    this.languageSubscriber();
    this.authSubscriber();
  }

  ngOnDestroy(): void {
    this.ngDestroy.next(true);
    this.ngDestroy.complete();
  }


  private initLanguageForm() {
    this.languageForm = this.fb.group({
      language: [null]
    });
    this.languageWatcher();
  }

  private languageWatcher(): void {
    this.languageForm.get('language').valueChanges
      .subscribe((languageId) => {
        this.translateService.setDefaultLang(languageId === LanguageEnum.English ? 'en' : 'hy');
        if (this.authApiService.isAuthenticated()) {
          const model = new UserSettingModel(this.authApiService.getCurrentUser().id, languageId);
          this.setUserLanguageSettings(model);
        }
      });
  }

  private setUserLanguageSettings(userSetting: UserSettingModel): void {
    this.settingsService.setUserSettings(userSetting)
      .subscribe(() => {
      });
  }

  private getUserSetting(id: number): void {
    this.settingsService.getUserSettings(id)
      .subscribe((res) => {
        if (res && res.model && res.model.language) {
          this.languageForm.get('language').patchValue(res.model.language);
        } else {
          console.error('not found');
        }
      });
  }

  private languageSubscriber(): void {
    this.globalVarsService.currentLanguage
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(res => {
        if (res) {
          this.languageForm.get('language').patchValue(res);
        }
      });
  }

  public onSignOutClick(moreTooltip: NgbTooltip): void {
    moreTooltip.close();
    this.signOutModal.show();
  }

  public onHideSignOutModal(): void {
    this.signOutModal.hide();
  }

  public onSignOutConfirmed(): void {
    this.authApiService.signOut();
    this.globalVarsService.isAuthenticated.next(false);
    this.signOutModal.hide();
    this.showNotificationMessage('NOTIFY_MESSAGES.sign_out');
    this.router.navigate(['sign-in']);
  }

  private authSubscriber(): void {
    this.globalVarsService.isAuthenticated
      .subscribe((isAuth) => {
        this.isAuth = isAuth;
        if (this.isAuth) {
          this.currentUser = this.authApiService.getCurrentUser();
          this.getUserSetting(this.currentUser.id);
        } else {
          this.currentUser = null;
        }
      });
  }

  private checkInitialAuth(): void {
    if (this.authApiService.isAuthenticated()) {
      this.globalVarsService.isAuthenticated.next(true);
      this.currentUser = this.authApiService.getCurrentUser();
      this.getUserSetting(this.currentUser.id);
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
  }

  public onHideSignInModal(): void {
    this.signInModal.hide();
  }

  public onSignInClick(): void {
    this.signInModal.show();
  }

  public onAtEventLogin(): void {
    this.signInModal.hide();
    this.router.navigate(['sign-in']);
  }

  public changeAtEventPhoto(isHover: boolean): void {
    this.atEventPhotoUrl = isHover ? 'assets/images/ae-white.png' : 'assets/images/ae-icon.png';
  }

  public onFacebookLogin(): void {
    this.signInModal.hide();
    const providerId = FacebookLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(providerId)
      .then(res => {
        if (res) {
          this.authForUserFromSocial(res);
        }
      });
  }

  public onGoogleLogin(): void {
    this.signInModal.hide();
    const providerId = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(providerId)
      .then(res => {
        if (res) {
          this.authForUserFromSocial(res);
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

  private addUser(model: UserModel): void {
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

  public onTooltipHover(tooltip: NgbTooltip): void {
    if (!this.isAuth) {
      this.closeCurrentTooltip();
      this.currentTooltip = tooltip;
      tooltip.open();
    }
  }

  public closeCurrentTooltip(): void {
    if (!this.isAuth) {
      if (this.currentTooltip) {
        this.currentTooltip.close();
      }
    }
  }

  private showNotificationMessage(key: string): void {
    this.translateService.get(key)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }
}
