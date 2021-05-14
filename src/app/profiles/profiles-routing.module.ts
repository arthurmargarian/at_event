import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfilesComponent } from './profiles.component';
import { UserEventsComponent } from './components/user-events/user-events.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { EventsGridComponent } from '../shared/components/events-grid/events-grid.component';
import { UsersGridComponent } from '../shared/components/users-grid/users-grid.component';
import { OrganizationsGridComponent } from '../shared/components/organizations-grid/organizations-grid.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent
  },
  {
    path: ':id',
    component: UserProfileComponent,
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
        path: 'interested-events',
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
        path: 'following',
        component: UserFollowingComponent,
        children: [
          {
            path: 'events',
            component: EventsGridComponent
          },
          {
            path: 'users',
            component: UsersGridComponent
          },
          {
            path: 'organizations',
            component: OrganizationsGridComponent
          },
        ]
      },
      {
        path: 'followers',
        component: UsersGridComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule {
}
