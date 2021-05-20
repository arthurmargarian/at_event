import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatCalendar, MatDateFormats, MatDatepicker } from '@angular/material';
import { DatePickerService } from '../../services';

@Component({
  selector: 'app-datepicker-header',
  templateUrl: './datepicker-header.component.html',
  styleUrls: ['./datepicker-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DatepickerHeaderComponent<D> {

  // tslint:disable-next-line:variable-name
  constructor(@Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
              private datePickerService: DatePickerService,
              // tslint:disable-next-line:variable-name
              private _calendar: MatCalendar<D>,
              private matDatepicker: MatDatepicker<D>,
              // tslint:disable-next-line:variable-name
              private _dateAdapter: DateAdapter<D>,
              private cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .subscribe(() => cdr.markForCheck());

  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  public previousClicked(mode: 'month' | 'year'): void {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  public nextClicked(mode: 'month' | 'year'): void {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }

  public setToday(): void {
    this.datePickerService.setToday.next(this.matDatepicker.id);
  }
}

