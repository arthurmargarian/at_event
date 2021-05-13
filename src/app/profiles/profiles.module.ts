import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfilesComponent } from './profiles.component';
import { SharedModule } from '../shared/shared.module';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PanelModule } from 'primeng/panel';
import { UserEventsComponent } from './components/user-events/user-events.component';
import { UserFollowingsComponent } from './components/user-followings/user-followings.component';

@NgModule({
  declarations: [
    ProfilesComponent,
    UserProfileComponent,
    UserEventsComponent,
    UserFollowingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfilesRoutingModule,
    NgbTooltipModule,
    PanelModule
  ]
})
export class ProfilesModule {
}
