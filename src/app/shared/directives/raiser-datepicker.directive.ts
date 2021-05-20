import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { AppSettings } from '../../infratructure/constants/app.settings';
import moment from 'moment';


@Directive({
  selector: '[appDatePickerMask]'
})
export class DatePickerDirective implements OnInit, OnChanges {

  @Input() dateFormat = AppSettings.DATE_FORMAT;
  @Input() inputValue;
  @Input() min;
  @Input() max;
  @Input() clearInput: boolean;
  @Output() validateInput = new EventEmitter<any>();

  private allowKeyCodes = [8, 9, 13, 17, 32, 35, 36, 37, 38, 39, 40, 46, 109, 111, 186, 189, 190, 191];
  private dateSeparators = ['/', '.', ':', '-', '_', ' '];
  private monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  private separator = '/';
  private dateFormatParts: string[];

  constructor(private el: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.calculateSeparatorProps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('dateFormat' in changes && !changes.dateFormat.firstChange) {
      this.calculateSeparatorProps();
    }

    if ('inputValue' in changes) {
      const currentElement = this.el.nativeElement;
      const currentValue: string = currentElement.value;

      const changedDate = new Date(changes.inputValue.currentValue);
      if ((changes.inputValue.currentValue === null || changedDate.getTime() === 0) && currentValue) {
        this.validateInput.emit({
          required: false
        });
      } else if (changes.inputValue.currentValue === null && !currentValue) {
        this.validateInput.emit(null);
      } else if (changes.inputValue.currentValue !== undefined && currentValue) {
        const parsedCurrentValue = moment(changes.inputValue.currentValue).format(this.dateFormat);
        const dateParts = parsedCurrentValue.split(this.separator);
        this.validateInputValue(dateParts);
      }
    }

    if ('clearInput' in changes && changes.clearInput.currentValue) {
      const currentElement = this.el.nativeElement;
      this.renderer.setProperty(currentElement, 'value', null);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const currentElement = this.el.nativeElement;
    const currentValue: string = currentElement.value;

    if ((this.inputValue === null || new Date(this.inputValue).getTime() === 0) && currentValue) {
      this.validateInput.emit({
        required: false
      });
    }

    if (event.key && event.key.toLocaleLowerCase() === 'a' && event.ctrlKey) {
      // ctrl+a was entered
      return;
    }

    let nextStr = '';
    // tslint:disable-next-line:variable-name
    const _value = currentValue.split('');

    if (currentElement.selectionStart !== currentElement.selectionEnd) {
      if (event.keyCode === 8 || event.keyCode === 46) {
        _value.splice(currentElement.selectionStart, currentElement.selectionEnd);
      } else if (/[0-9]/.test(event.key)) {
        _value.splice(currentElement.selectionStart, currentElement.selectionEnd, event.key);
      }
    } else {
      if (event.keyCode === 8) {
        _value.splice(currentElement.selectionStart - 1, 1);
      } else if (event.keyCode === 46) {
        _value.splice(currentElement.selectionStart, 1);
      } else if (/[0-9]/.test(event.key)) {
        _value.splice(currentElement.selectionStart, 0, event.key);
      }
    }

    nextStr = _value.join('');

    if (nextStr.split(this.separator).length === 2) {
      const separatorIndex = nextStr.indexOf(this.separator);
      if (currentElement.selectionStart + 1 <= separatorIndex) {
        if (currentElement.selectionStart + 1 === this.dateFormatParts[0].length) {
          _value.splice(this.dateFormatParts[0].length, 0, this.separator);
          this.renderer.setProperty(currentElement, 'value', _value.join(''));
          currentElement.setSelectionRange(currentElement.selectionStart + 1, this.dateFormatParts[0].length + 1);
          event.preventDefault();
        }
      }
    }

    if (!/[0-9]/.test(event.key)) {
      if (this.allowKeyCodes.every(keyCode => keyCode !== event.keyCode)) {
        if (event.key && this.checkIsWrittenMonthName(nextStr, currentElement, event)) {
          return;
        }
        event.preventDefault();
      }

    }

    if (currentValue && event.key === this.separator) {
      const fullString = currentValue + this.separator;
      if (fullString.split(this.separator).length > this.dateFormatParts.length) {
        event.preventDefault();
      }
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const currentElement = this.el.nativeElement;
    const currentValue: string = currentElement.value;

    if ((this.inputValue === null || new Date(this.inputValue).getTime() === 0) && currentValue) {
      this.validateInput.emit({
        required: false
      });
    }
  }

  @HostListener('blur')
  onBlur() {
    const currentElement = this.el.nativeElement;
    const currentValue: string = currentElement.value;
    if (this.inputValue === null && currentValue) {
      this.validateInput.emit({
        required: false,
        wrongDateFormat: this.dateFormat
      });
    } else if ((this.inputValue === null || this.inputValue === undefined) && !currentValue) {
      this.validateInput.emit(null);
    } else {
      const dateParts = currentValue.split(this.separator);
      this.validateInputValue(dateParts);
    }
  }

  private get dateIndexOf() {
    const monthIndex = this.dateFormatParts.findIndex(m => m.toLowerCase().includes('m'));
    const dayIndex = this.dateFormatParts.findIndex(m => m.toLowerCase().includes('d'));
    const yearIndex = this.dateFormatParts.findIndex(m => m.toLowerCase().includes('y'));

    return {
      month: monthIndex,
      day: dayIndex,
      year: yearIndex
    };
  }

  private calculateSeparatorProps() {
    this.dateSeparators.forEach(item => {
      if (this.dateFormat.includes(item)) {
        this.separator = item;
      }
    });

    this.dateFormatParts = this.dateFormat.split(this.separator);
  }

  private checkIsWrittenMonthName(nextStr: string, currentElement, event) {
    if (!this.dateFormatParts.some(p => p.toLowerCase() === 'mmm')) {
      return false;
    }
    let monthStartIndex = currentElement.selectionStart;

    for (let i = currentElement.selectionStart - 1; i >= 0; i--) {
      if (/[0-9]/.test(nextStr[i]) || this.dateSeparators.some(separator => separator === nextStr[i])) {
        break;
      }
      monthStartIndex--;
    }

    // tslint:disable-next-line:max-line-length
    const nextMonthValue = nextStr.length <= monthStartIndex ? event.key : nextStr.slice(monthStartIndex, currentElement.selectionStart) + event.key;
    return this.monthNames.some(month => month.toLowerCase().indexOf(nextMonthValue.toLowerCase()) === 0);
  }

  private validateInputValue(dateParts) {
    // Final error emits
    if (dateParts.length !== this.dateFormatParts.length) {
      this.validateInput.emit({
        wrongDateFormat: this.dateFormat
      });
      return;
    }
    if (this.dateIndexOf.year !== -1 && dateParts[this.dateIndexOf.year].length > 2 &&
      (Number(dateParts[this.dateIndexOf.year]) > 2100 || Number(dateParts[this.dateIndexOf.year]) < 1800)) {
      this.validateInput.emit({
        wrongYearRange: [1800, 2100]
      });
      return;
    } else {
      const inputValue = moment(this.inputValue).format(AppSettings.MOMENT_DATE_FORMAT);
      const min = moment(this.min).format(AppSettings.MOMENT_DATE_FORMAT);
      const max = moment(this.max).format(AppSettings.MOMENT_DATE_FORMAT);
      const minError = this.min && moment(inputValue).isBefore(moment(min));
      const maxError = this.max && moment(inputValue).isAfter(moment(max));
      if ((this.inputValue !== null || this.inputValue !== undefined) && (minError || maxError)) {
        const rangeError = minError ? 'minError' : 'maxError';
        this.validateInput.emit({
          wrongRange: rangeError
        });
        return;
      }
    }
    this.validateInput.emit(null);
  }
}
