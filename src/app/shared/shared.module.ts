import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgSelectModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgSelectModule,
    LoaderComponent,
    HeaderComponent
  ],
  providers: []
})
export class SharedModule {
}
