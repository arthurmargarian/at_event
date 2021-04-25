import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageEnum } from '../../../infratructure/enums/language.enum';
import { Languages } from '../../../infratructure/constants/language.const';
import { LanguageModel } from '../../../infratructure/models/language.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthApiService } from '../../../auth/auth-service.service';
import { SettingsService } from '../services/settings.service';
import { UserModel } from '../../../infratructure/models/user.model';
import { UserSettingModel } from '../../../infratructure/models/user-setting.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public languageForm: FormGroup;
  public languages: LanguageModel[];
  public currentUser: UserModel;

  constructor(private fb: FormBuilder,
              private router: Router,
              public authApiService: AuthApiService,
              private settingsService: SettingsService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.initLanguageForm();
    this.languages = Languages;
    if (this.authApiService.isAuthenticated()) {
      this.currentUser = this.authApiService.getCurrentUser();
      this.getUserSetting(this.currentUser.id);
    }
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
          this.setUserSettings(model);
        }
      });
  }

  private setUserSettings(userSetting: UserSettingModel): void {
    this.settingsService.setUserSettings(userSetting).subscribe(() => {
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
}
