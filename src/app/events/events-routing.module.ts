import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EventNavigatorComponent } from './components/event-navigator/event-navigator.component';
import { EventsForYouComponent } from './components/events-for-you/events-for-you.component';
import { YoursEventsComponent } from './components/yours-events/yours-events.component';
import { NotAuthGuard } from '../guards/not-auth.guard';
import { EventsComponent } from './events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
  },
  {
    path: 'navigator',
    component: EventNavigatorComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'create',
    component: CreateEventComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'for-you',
    component: EventsForYouComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'yours',
    component: YoursEventsComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}
