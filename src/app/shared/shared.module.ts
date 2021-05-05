import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsService } from './services/settings.service';


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
        NgbModule,
    ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgSelectModule,
    // Components
    LoaderComponent,
    HeaderComponent
  ],
  providers: [
    SettingsService,
  ]
})
export class SharedModule {
}
