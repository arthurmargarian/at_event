import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-html-area',
  templateUrl: './html-area.component.html',
  styleUrls: ['./html-area.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HtmlAreaComponent),
    multi: true
  }]
})
export class HtmlAreaComponent implements OnInit, ControlValueAccessor {
  // tslint:disable-next-line:ban-types
  @Input() config: Object = {height: 220};
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      html: []
    });
  }

  writeValue(html: string): void {
    this.form.get('html').patchValue(html);
  }

  registerOnChange(fn: any): void {
    this.form.get('html').valueChanges.subscribe(value => {
      fn(value);
    });
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.get('html').disable();
    } else {
      this.form.get('html').enable();
    }
  }

}
