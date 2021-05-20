import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaiserDatepickerComponent } from './raiser-datepicker.component';
import { MatDatepickerModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DatepickerHeaderComponent } from './shared/components';
import { DatePickerService } from './shared/services';
import { RaiserDateAdapter } from './shared/raiser-date-adapter';
import { DatePickerDirective } from '../../directives/raiser-datepicker.directive';

@NgModule({
  declarations: [
    RaiserDatepickerComponent,
    DatePickerDirective,
    DatepickerHeaderComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    RaiserDatepickerComponent
  ],
  entryComponents: [
    DatepickerHeaderComponent
  ],
  providers: [
    DatePickerService,
    RaiserDateAdapter
  ]
})
export class RaiserDatepickerModule { }
