import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


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
    ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    HeaderComponent
  ],
  providers: []
})
export class SharedModule {
}
