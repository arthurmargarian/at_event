import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfilesComponent } from './profiles.component';
import { SharedModule } from '../shared/shared.module';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { NgbTimepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PanelModule } from 'primeng/panel';
import { UserEventsComponent } from './components/user-events/user-events.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { UserProfileService } from './services/user-profile.service';
import { ModalModule } from 'ngx-bootstrap';
import { EventAddEditComponent } from './components/event-add-edit/event-add-edit.component';
import { OrgAddEditComponent } from './components/org-add-edit/org-add-edit.component';
import { OrganizationsComponent } from './components/organizations/organizations.component';
import { RaiserDatepickerModule } from '../shared/components/raiser-datepicker/raiser-datepicker.module';

@NgModule({
  declarations: [
    ProfilesComponent,
    UserProfileComponent,
    UserEventsComponent,
    UserFollowingComponent,
    EventAddEditComponent,
    OrgAddEditComponent,
    OrganizationsComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        ProfilesRoutingModule,
        NgbTooltipModule,
        PanelModule,
        ModalModule,
        RaiserDatepickerModule,
        NgbTimepickerModule
    ],
  providers: [
    UserProfileService
  ]
})
export class ProfilesModule {
}
