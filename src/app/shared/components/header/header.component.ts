import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageEnum } from '../../../infratructure/enums/language.enum';
import { Languages } from '../../../infratructure/constants/language.const';
import { LanguageModel } from '../../../infratructure/models/language.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthApiService } from '../../../auth/auth-service.service';
import { SettingsService } from '../../services/settings.service';
import { UserSettingModel } from '../../../infratructure/models/user-setting.model';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GlobalVarsService } from '../../../global-vars.service';
import { ModalDirective } from 'ngx-bootstrap';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';

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
  public currentUser: UserInterface;
  private ngDestroy = new Subject();
  public isAuth: boolean;
  private currentTooltip: NgbTooltip;
  public defaultProfilePic = 'assets/images//default-profile-pic.png';

  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private authApiService: AuthApiService,
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
    this.globalVarsService.signedInUser.next(null);
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
