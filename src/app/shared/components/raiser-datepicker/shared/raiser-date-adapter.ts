import { Inject, Injectable, Optional } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { AppSettings } from '../../../../infratructure/constants/app.settings';
import { GeneralSettingsModel } from '../../../../infratructure/models/general-settings.model';

@Injectable()
export class RaiserDateAdapter extends MomentDateAdapter {

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  private defaultFormat = 'DD/MM/YYYY';
  private conflictFormat = 'DD MMM YYYY';
  private WEEK_START = (JSON.parse(localStorage.getItem(AppSettings.generalSettingsKey)) as GeneralSettingsModel) &&
  (JSON.parse(localStorage.getItem(AppSettings.generalSettingsKey)) as GeneralSettingsModel).startOfWeek;

  parse(value, parseFormat) {
    if (parseFormat === this.conflictFormat && !moment(value, parseFormat, true).isValid()) {
      return super.parse(value, this.defaultFormat);
    }

    return super.parse(value, parseFormat);
  }

  getFirstDayOfWeek(): number {
    return this.WEEK_START;
  }

}
