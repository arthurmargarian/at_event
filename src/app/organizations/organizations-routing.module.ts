import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationViewComponent } from './components/organization-view/organization-view.component';
import { UserEventsComponent } from '../profiles/components/user-events/user-events.component';
import { EventsGridComponent } from '../shared/components/events-grid/events-grid.component';
import { UsersGridComponent } from '../shared/components/users-grid/users-grid.component';
import { OrganizationsGridComponent } from '../shared/components/organizations-grid/organizations-grid.component';
import { OrganizationsComponent } from '../profiles/components/organizations/organizations.component';
import { OrgAddEditComponent } from '../profiles/components/org-add-edit/org-add-edit.component';
import { EventAddEditComponent } from '../profiles/components/event-add-edit/event-add-edit.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: ':id',
    component: OrganizationViewComponent,
    children: [
      {
        path: 'created-events',
        component: UserEventsComponent,
        children: [
          {
            path: 'active',
            component: EventsGridComponent
          },
          {
            path: 'upcoming',
            component: EventsGridComponent
          },
          {
            path: 'past',
            component: EventsGridComponent
          },
          {
            path: 'canceled',
            component: EventsGridComponent
          },
          {
            path: 'closed',
            component: EventsGridComponent
          },
          {
            path: 'all',
            component: EventsGridComponent
          },
        ]
      },
      {
        path: 'followers',
        component: UsersGridComponent,
      },
      {
        path: 'organizations',
        component: OrganizationsComponent,
        children: [
          {
            path: 'your',
            component: OrganizationsGridComponent
          },
          {
            path: 'new',
            component: OrgAddEditComponent
          },
          {
            path: ':orgId',
            component: OrgAddEditComponent
          }
        ]
      },
      {
        path: 'create-org-event',
        component: EventAddEditComponent,
        canActivate: [AuthGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule {
}
