import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  providers: []
})
export class SharedModule {
}
