import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsService } from './services/settings.service';
import { ModalModule } from 'ngx-bootstrap';
import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule } from 'ng-social-login';
import { SocialAuthComponent } from './components/social-auth/social-auth.component';
import { UserService } from './services/user.service';
import { EventsGridComponent } from './components/events-grid/events-grid.component';
import { UsersGridComponent } from './components/users-grid/users-grid.component';
import { OrganizationsGridComponent } from './components/organizations-grid/organizations-grid.component';
import { OrganizationService } from './services/organization.service';
import { SelectSorterDirective } from './directives/select-sorter.directive';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { InterestsComponent } from './components/interests/interests.component';
import { HtmlAreaComponent } from './components/html-area/html-area.component';
import { NgxTinymceModule } from 'ngx-tinymce';
import { RaiserDatepickerModule } from './components/raiser-datepicker/raiser-datepicker.module';
import { EventService } from './services/event.service';

const GOOGLE_OAUTH_CLIENT_ID = '174901231009-eni8jt11p1mc7hritqetmlpfj63pk0qf.apps.googleusercontent.com';
const FACEBOOK_APP_ID = '2261974733824223';

const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(GOOGLE_OAUTH_CLIENT_ID)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(FACEBOOK_APP_ID)
  }
]);

export function provideConfig() {
  return CONFIG;
}


@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent,
    SocialAuthComponent,
    EventsGridComponent,
    UsersGridComponent,
    OrganizationsGridComponent,
    SelectSorterDirective,
    MultiselectComponent,
    InterestsComponent,
    HtmlAreaComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgSelectModule,
    NgbModule,
    SocialLoginModule,
    RaiserDatepickerModule,
    ModalModule.forRoot(),
    FormsModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
      config: {
        height: 500,
        branding: false,
        menubar: false,
        elementpath: false,
        toolbar1: 'undo redo | formatselect | bold italic | numlist | link image table | removeformat',
        plugins: [
          'advlist autolink lists link image print preview textcolor',
          'searchreplace visualblocks code fullscreen',
          'table paste code',
        ],
        browser_spellcheck: true,
        content_css: [
          'assets/style/tinymce.css',
          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          '//www.tiny.cloud/css/codepen.min.css'
        ]
      }
    })
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
    HeaderComponent,
    EventsGridComponent,
    SocialAuthComponent,
    MultiselectComponent,
    InterestsComponent,
    HtmlAreaComponent
  ],
  providers: [
    SettingsService,
    UserService,
    EventService,
    OrganizationService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class SharedModule {
}
