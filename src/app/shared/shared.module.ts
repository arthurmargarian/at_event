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
import { ModalModule } from 'ngx-bootstrap';
import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule } from 'ng-social-login';
import { SocialAuthComponent } from './components/social-auth/social-auth.component';
import { UserService } from './services/user.service';
import { EventsGridComponent } from './components/events-grid/events-grid.component';
import { UsersGridComponent } from './components/users-grid/users-grid.component';
import { OrganizationsGridComponent } from './components/organizations-grid/organizations-grid.component';

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
    OrganizationsGridComponent
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
    ModalModule.forRoot(),
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
        SocialAuthComponent
    ],
  providers: [
    SettingsService,
    UserService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class SharedModule {
}
