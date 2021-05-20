import { Component, DoCheck, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepicker } from '@angular/material';
import { MatDateFormats } from '@angular/material/typings/core';
import moment from 'moment';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DatepickerHeaderComponent } from './shared/components';
import { RaiserDateAdapter } from './shared/raiser-date-adapter';
import { DatePickerService } from './shared/services/date-picker.service';
import { GeneralSettingsModel } from '../../../infratructure/models/general-settings.model';
import { AppSettings } from '../../../infratructure/constants/app.settings';

const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ( new GeneralSettingsModel(0, 0, 'dd/MM/yyyy')).dateFormat.toUpperCase(),
  },
  display: {
    dateInput: ( new GeneralSettingsModel(0, 0, 'dd/MM/yyyy')).dateFormat.toUpperCase(),
    monthYearLabel: 'YYYY-MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-raiser-datepicker',
  templateUrl: './raiser-datepicker.component.html',
  styleUrls: ['./raiser-datepicker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: RaiserDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS}
  ]
})
export class RaiserDatepickerComponent implements OnInit, OnChanges, DoCheck, ControlValueAccessor, OnDestroy {
  @ViewChild(MatDatepicker) picker;

  @Input() hideLabel = true;
  @Input() placeholder = null;
  @Input() label: string;
  @Input() dateRanges: Array<any> = null;
  @Input() controlDisabled: boolean;
  @Input() inputDisabled: boolean;
  @Input() startView = 'month';
  @Input() closePickerAfter = '';
  @Input() minDate = AppSettings.MIN_DATE;
  @Input() maxDate = AppSettings.MAX_DATE;
  @Input() customHeader = true;
  @Input() takeLatestDate = false;
  @Output() dateChange = new EventEmitter();
  // tslint:disable-next-line:variable-name
  private _value: string;
  public dateFormats = DATE_FORMATS;
  public dateFormat = AppSettings.DATE_FORMAT;
  public datePickerError = null;
  public clearInput: boolean;
  // tslint:disable-next-line:ban-types
  onChange: Function;
  // tslint:disable-next-line:ban-types
  onTouched: Function;
  public datepickerHeader = DatepickerHeaderComponent;
  // tslint:disable-next-line:variable-name
  private _destroyed = new Subject<void>();

  constructor(private ngControl: NgControl,
              private datePickerService: DatePickerService) {
    ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.todayButtonSubscriber();

    window.addEventListener(AppSettings.storageKey, this.storageListener.bind(this));
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
    window.removeEventListener(AppSettings.storageKey, this.storageListener.bind(this));
  }

  private storageListener(event): void {
    if (event.key === AppSettings.generalSettingsKey) {
    }
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.clearInput = this.ngControl.pristine && this.ngControl.untouched && !this.ngControl.value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('controlDisabled' in changes) {
      if (changes.controlDisabled.currentValue) {
        this.getEmitedError(null);
      }
    }
    if ('inputDisabled' in changes) {
      if (changes.inputDisabled.currentValue) {
        this.getEmitedError(null);
      }
    }
  }

  private todayButtonSubscriber() {
    this.datePickerService.setToday
      .pipe(
        filter(i => !!i),
        takeUntil(this._destroyed)
      )
      .subscribe(res => {
        if (res !== this.picker.id) {
          return;
        }
        let canSelect = false;
        if (!this.minDate) {
          if (this.maxDate) {
            if (moment(this.maxDate).isAfter(moment())) {
              canSelect = true;
            }
          } else {
            canSelect = true;
          }
        } else {
          if (moment(this.minDate).isBefore(moment())) {
            if (this.maxDate) {
              if (moment(this.maxDate).isAfter(moment())) {
                canSelect = true;
              }
            } else {
              canSelect = true;
            }
          }
        }
        if (canSelect) {
          this.onChange(this.setToday);
          this.dateChange.emit();
          this.picker.close();
        }
      });
  }

  // ControlValueAccessor
  get value() {
    return this._value;
  }

  set value(value: string) {
    if (!value) {
      this.getEmitedError(null);
    }
    this._value = value;
    if (this.onChange) {
      this.onChange(this.dateTemplate);
    }
  }

  public onDateChange(event) {
    this.dateChange.emit(event);
  }

  get dateTemplate() {
    const rawDate = new Date(this.value);
    let month = `${rawDate.getMonth() + 1}`;
    let day = `${rawDate.getDate()}`;

    if ((rawDate.getMonth() + 1) < 10) {
      month = `0${month}`;
    }

    if (rawDate.getDate() < 10) {
      day = `0${day}`;
    }
    return this.value ? `${rawDate.getFullYear()}-${month}-${day}` : null;
  }

  get setToday() {
    const rawDate = new Date();
    let month = `${rawDate.getMonth() + 1}`;
    let day = `${rawDate.getDate()}`;
    if ((rawDate.getMonth() + 1) < 10) {
      month = `0${month}`;
    }
    if (rawDate.getDate() < 10) {
      day = `0${day}`;
    }
    const date = `${rawDate.getFullYear()}-${month}-${day}`;
    this.writeValue(date);
    return date;
  }

  public filterOut(d): boolean {
    const day = new Date(d);

    return this.dateRanges ? this.dateRanges.every(range =>
      (day < new Date(range.from) || day > new Date(range.to)) ||
      (day < new Date(range.from) && day < new Date(range.to)) ||
      (day > new Date(range.from) && day > new Date(range.to))
    ) : true;
  }

  public getEmitedError(formError): void {
    this.datePickerError = formError;

    const control = this.ngControl && this.ngControl.control;

    let updatedError = control && control.errors ? {
      ...control.errors,
      ...formError
    } : formError;

    if (control && control.validator && !control.value) {
      const validator = control.validator(control);
      if (validator && !formError) {
        if (updatedError) {
          validator.required ? updatedError.required = validator.required : delete updatedError.required;
        } else if (validator.required) {
          updatedError = {
            required: validator.required
          };
        }
      }
    }

    if (control) {
      setTimeout(() => {
        if (updatedError && !updatedError.required) {
          delete updatedError.required;
          if (!Object.keys(updatedError).length) {
            updatedError = null;
          }
        }
        control.setErrors(updatedError);
        control.updateValueAndValidity();
        if (updatedError) {
          control.parent.setErrors(updatedError);
        }
      });
    }
  }

  writeValue(obj: string): void {
    this.value = obj;
  }

  // tslint:disable-next-line:ban-types
  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  // tslint:disable-next-line:ban-types
  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  public onFocusOut() {
    if (this.onTouched) {
      this.onTouched(this.dateTemplate);
    }
  }

  public monthSelected(date: any): void {
    if (this.closePickerAfter === 'month') {
      if (this.takeLatestDate) {
        this.value = moment(date).endOf('month').toISOString();
      } else {
        this.value = date;
      }
      this.dateChange.emit(this.dateTemplate);
      this.picker.close();
    }
  }

  public yearSelected(date: any): void {
    if (this.closePickerAfter === 'year') {
      if (this.takeLatestDate) {
        this.value = moment(date).endOf('year').toISOString();
      } else {
        this.value = date;
      }
      this.dateChange.emit(this.dateTemplate);
      this.picker.close();
    }
  }
}
