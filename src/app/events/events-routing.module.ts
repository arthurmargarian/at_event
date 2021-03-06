import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { EventNavigatorComponent } from './components/event-navigator/event-navigator.component';
import { EventsForYouComponent } from './components/events-for-you/events-for-you.component';
import { EventsComponent } from './events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
  },
  {
    path: 'navigator',
    component: EventNavigatorComponent,
    canActivate: [],
  },
  {
    path: 'for-you',
    component: EventsForYouComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}
