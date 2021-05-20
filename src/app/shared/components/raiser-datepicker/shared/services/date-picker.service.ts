import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DatePickerService implements OnDestroy {
  public setToday = new BehaviorSubject<string>(null);

  constructor() {
  }

  ngOnDestroy() {
    this.setToday.complete();
  }
}
