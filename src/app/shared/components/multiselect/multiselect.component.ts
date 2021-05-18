import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

export const RAZOR_MULTISELECT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'razor-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [RAZOR_MULTISELECT_CONTROL_VALUE_ACCESSOR]
})
export class MultiselectComponent implements ControlValueAccessor, OnInit {
  @ViewChild('input') private input: NgSelectComponent;
  @Input() items: Array<any>;
  @Input() searchable: boolean;
  @Input() addTag: boolean;
  @Input() isCustomSearch: boolean;
  @Input() placeholder: string;
  @Input() bindValue = 'value';
  @Input() bindLabel = 'label';
  @Input() showCount = 1;
  @Input() disabled: boolean;
  @Input() sorted = true;
  @Output() change = new EventEmitter();
  @Input() displayBy = 'name';
  public innerValues = [];
  public renderTemplate = true;
  public searchCollection: any[] = null;

  private isOpen: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onValueChange(items) {
    if (items && items.length && typeof items[items.length - 1] === 'string') {
      this.renderTemplate = false;
      items = items.map(element => element = {label: element});
      this.items = [...items];
      setTimeout(() => {
        this.renderTemplate = true;
      }, 0);
    }
    if (items && this.isOpen) {
      const input = this.input.filterInput.nativeElement;
      input.value = '';
      input.dispatchEvent(new Event('input'));
    }
    setTimeout(() => {
      if (this.bindValue) {
        const selectedValues = items.map(item => item[this.addTag ? this.bindLabel : this.bindValue]);
        if (this.innerValues && selectedValues.length === this.innerValues.length) {
          this.propagateChange(selectedValues);
          this.change.emit(selectedValues);
        }
      } else {
        this.input.filterInput.nativeElement.value = '';
        this.change.emit(items);
        this.propagateChange(items);
      }
    }, 0);
  }

  public setOpenedState(isOpen: boolean): void {
    this.isOpen = isOpen;
  }

  public get value(): any {
    return this.innerValues;
  }

  public set value(val: any) {
    if (val !== this.innerValues) {
      this.innerValues = val;
    }
  }

  public propagateChange = (_: any) => {
  }

  public writeValue(value: any): void {
    this.innerValues = value;
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {

  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onRemove() {
    this.innerValues = [];
    this.propagateChange(this.innerValues);
    this.change.emit(this.innerValues);
  }

  public onCustomSearch(event: { term: string; items: any[] }) {
    const str = event.term.toLowerCase();
    const firstPart = this.items.filter(i => i.label.toLowerCase().startsWith(str));
    const secondPart = this.items.filter(i => i.label.toLowerCase().includes(str));
  }

}
