import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

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
    path: 'events',
    component: LayoutComponent,
    loadChildren: './events/events.module#EventsModule',
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
