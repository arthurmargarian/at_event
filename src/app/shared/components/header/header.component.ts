import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageEnum } from '../../../infratructure/enums/language.enum';
import { Languages } from '../../../infratructure/constants/language.const';
import { LanguageModel } from '../../../infratructure/models/language.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public languageForm: FormGroup;
  public languages: LanguageModel[];

  constructor(private fb: FormBuilder, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.initLanguageForm();
    this.languages = Languages;
  }

  private initLanguageForm() {
    this.languageForm = this.fb.group({
      language: [LanguageEnum.English]
    });
    this.languageWatcher();
  }

  private languageWatcher(): void {
    this.languageForm.get('language').valueChanges
      .subscribe((val) => {
        this.translateService.setDefaultLang(val === LanguageEnum.English ? 'en' : 'hy');
      });

  }
}
