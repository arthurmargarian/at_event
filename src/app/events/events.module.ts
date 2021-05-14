import { NgModule } from '@angular/core';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EventNavigatorComponent } from './components/event-navigator/event-navigator.component';
import { EventsForYouComponent } from './components/events-for-you/events-for-you.component';
import { SharedModule } from '../shared/shared.module';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';
import { EventsRoutingModule } from './events-routing.module';

@NgModule({
  declarations: [
    EventsComponent,
    CreateEventComponent,
    EventNavigatorComponent,
    EventsForYouComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    EventsRoutingModule
  ]
})
export class EventsModule {
}
