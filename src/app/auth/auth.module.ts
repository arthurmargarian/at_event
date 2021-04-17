import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth-service.service';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    TranslateModule,
  ],
  providers: [AuthService]
})
export class AuthModule {
}
