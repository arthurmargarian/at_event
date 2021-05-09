import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfilesComponent } from './profiles.component';
import { SharedModule } from '../shared/shared.module';
import { ProfilesRoutingModule } from './profiles-routing.module';

@NgModule({
  declarations: [
    ProfilesComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfilesRoutingModule
  ]
})
export class ProfilesModule {
}
