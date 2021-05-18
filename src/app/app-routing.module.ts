import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
  {
    path: '',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'profile',
    component: LayoutComponent,
    loadChildren: './profiles/profiles.module#ProfilesModule',
  },
  {
    path: 'organizations',
    component: LayoutComponent,
    loadChildren: './organizations/organizations.module#OrganizationsModule',
  },
  {
    path: 'events',
    component: LayoutComponent,
    loadChildren: './events/events.module#EventsModule',
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
