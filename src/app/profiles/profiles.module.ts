import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfilesComponent } from './profiles.component';
import { SharedModule } from '../shared/shared.module';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PanelModule } from 'primeng/panel';
import { UserEventsComponent } from './components/user-events/user-events.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { UserProfileService } from './services/user-profile.service';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    ProfilesComponent,
    UserProfileComponent,
    UserEventsComponent,
    UserFollowingComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        ProfilesRoutingModule,
        NgbTooltipModule,
        PanelModule,
        ModalModule
    ],
  providers: [
    UserProfileService
  ]
})
export class ProfilesModule {
}
