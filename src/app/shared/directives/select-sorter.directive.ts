import { Directive, OnInit, DoCheck } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Directive(
  // tslint:disable-next-line:directive-selector
  { selector: '[select-sorter]' })
export class SelectSorterDirective implements OnInit, DoCheck {

  constructor(private select: NgSelectComponent) { }

  private prevLength = 0;

  ngOnInit(): void {
    this.prevLength = this.select.items && this.select.items.length;
    if (this.prevLength > 0) {
      this.sortItems();
    }
  }

  ngDoCheck(): void {
    if (this.select.items && this.select.items.length != this.prevLength) {
      this.sortItems();
      this.prevLength = this.select.items.length;
    }
  }

  private sortItems(): void {
    const selectedItems = this.select.selectedItems;
    const label = this.select.bindLabel || 'label';

    const isNumArray = this.select.items.every(i => !isNaN(i[label]));

    if (isNumArray) {
      this.select.itemsList.setItems(this.select.items.sort((x, y) => x - y));
    } else {
      this.select.itemsList.setItems(this.select.items.sort((x, y) => {
        const val1 = x[label].toLowerCase();
        const val2 = y[label].toLowerCase();
        if (val1 > val2) {
          return 1;
        } else if (val2 > val1) {
          return -1;
        } else {
          return 0;
        }
      }));
    }

    selectedItems.map(item => {
      this.select.clearItem(item.value);
      const newItem = this.select.itemsList.items.find(it => it.value === item.value);
      if (newItem) {
        this.select.select(newItem);
      }
    });
  }
}
