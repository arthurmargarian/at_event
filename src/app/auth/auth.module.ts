import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider, SocialLoginModule } from 'ng-social-login';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './auth.component';
import { AuthApiService } from './auth-service.service';
import { SharedModule } from '../shared/shared.module';

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
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    SocialLoginModule
  ],
  providers: [
    AuthApiService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }]
})
export class AuthModule {
}
