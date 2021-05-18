import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OrganizationViewComponent } from './components/organization-view/organization-view.component';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PanelModule } from 'primeng/panel';
import { ModalModule } from 'ngx-bootstrap';
import { ProfilesModule } from '../profiles/profiles.module';

@NgModule({
  declarations: [OrganizationViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrganizationsRoutingModule,
    NgbTooltipModule,
    PanelModule,
    ProfilesModule,
    ModalModule
  ]
})
export class OrganizationsModule {
}
