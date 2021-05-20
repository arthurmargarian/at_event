import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../../infratructure/models/event.model';
import { EventStatusesEnum } from '../../../infratructure/enums/event-statuses.enum';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { OrganizationInterface } from '../../../infratructure/interfaces/organization.interface';
import { UserProfileService } from '../../../profiles/services/user-profile.service';
import { AppSettings } from '../../../infratructure/constants/app.settings';

@Component({
  selector: 'app-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.scss']
})
export class EventsGridComponent implements OnInit, OnChanges {
  @Input() limit = 6;
  @Input() isUpcomingEvents: boolean;
  @Input() isYerevanEvents: boolean;
  @Input() isGyumriEvents: boolean;
  @Input() isPartyEvents: boolean;
  @Input() isMusicEvents: boolean;
  @Input() filters: {
    name: string,
    region: number[],
    type: number[],
    status: number[]
  };
  currentTab: string;
  events: EventModel[];
  allEvents: EventModel[];
  dateFormat = AppSettings.MMM_D_Y;
  currentOrg: OrganizationInterface;
  currentUser: UserInterface;
  isLoading: boolean;
  private isCreatedEvents: boolean;
  private ownerId: number;
  private isUserEvents: boolean;
  private signedUser: UserInterface;

  constructor(private router: Router,
              private globalVarsService: GlobalVarsService,
              private userProfileService: UserProfileService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.checkUrl();
    this.getOrgFromService();
    this.isLoading = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters && changes.filters.currentValue) {
      this.searchEvents(this.filters);
    }
  }

  private getOrgFromService() {
    this.globalVarsService.currentOrg.subscribe(org => {
      if (org) {
        this.currentOrg = org;
        this.setEvents(this.isUserEvents, this.isCreatedEvents);
      } else {
        this.getCurrentUserFormService();
      }
    });
  }

  private getCurrentUserFormService() {
    this.userProfileService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.setEvents(this.isUserEvents, this.isCreatedEvents);
    });
  }

  private checkUrl(): void {
    const paths = this.router.url.split('/');
    console.log(paths);
    if (paths[2] === 'navigator') {
      this.getAllEvents();
    } else {
      if (paths[1] === 'dashboard') {
        this.getDashboardEvents();
      } else {
        if (paths[1] === 'events') {
          if (paths[2] === 'for-you') {
            this.getSignedUserFromService();
          }
        } else {
          this.isCreatedEvents = paths[3] === 'created-events';
          this.isUserEvents = paths[1] === 'profile';
          this.currentTab = paths[4];
          this.ownerId = +paths[2];
          this.getOrgFromService();
        }
      }
    }

  }

  private setEvents(isUserEvents: boolean, isCreatedEvents: boolean) {
    const eventIds = isCreatedEvents ?
      isUserEvents ? this.currentUser.eventIds : this.currentOrg.eventIds : this.currentUser.followingEventIds;
    this.getEventsByIds(eventIds);
  }


  private getEventsByIds(eventIds: number[]) {
    this.eventService.getEventsByIds(eventIds).subscribe(res => {
      if (res.model) {
        this.allEvents = res.model;
        this.setTabEvents(this.currentTab, this.allEvents);
      }
    });
  }

  private setTabEvents(tab: string, allEvents: EventModel[]) {
    switch (tab) {
      case 'all':
        this.events = allEvents;
        break;
      case 'upcoming':
        this.events = allEvents.filter(e => e.status === EventStatusesEnum.Upcoming);
        break;
      case 'active':
        this.events = allEvents.filter(e => e.status === EventStatusesEnum.Active);
        break;
      case 'past':
        this.events = allEvents.filter(e => e.status === EventStatusesEnum.Past);
        break;
      case 'canceled':
        this.events = allEvents.filter(e => e.status === EventStatusesEnum.Canceled);
        break;
      case 'closed':
        this.events = allEvents.filter(e => e.status === EventStatusesEnum.Closed);
        break;
    }
    this.isLoading = false;
  }

  private getSignedUserFromService() {
    this.globalVarsService.signedInUser.subscribe(user => {
      this.signedUser = user;
      this.getEventsByTypes(this.signedUser.interestedTypeIds);
    });
  }

  private getEventsByTypes(interestedTypeIds: number[]) {
    this.eventService.getEventsByTypes(interestedTypeIds)
      .subscribe(res => {
        if (res.model) {
          this.events = res.model;
          this.isLoading = false;
        }
      });
  }

  private getDashboardEvents() {
    if (this.isYerevanEvents) {
      this.eventService.getEventsByRegion(1)
        .subscribe(res => {
          if (res.model) {
            this.setLimitedEvents(res.model);
          }
        });
    }
    if (this.isGyumriEvents) {
      this.eventService.getEventsByRegion(8)
        .subscribe(res => {
          if (res.model) {
            this.setLimitedEvents(res.model);
          }
        });
    }
    if (this.isMusicEvents) {
      this.eventService.getEventsByType(2)
        .subscribe(res => {
          if (res.model) {
            this.setLimitedEvents(res.model);
          }
        });
    }
    if (this.isPartyEvents) {
      this.eventService.getEventsByType(20)
        .subscribe(res => {
          if (res.model) {
            this.setLimitedEvents(res.model);
          }
        });
    }
    if (this.isUpcomingEvents) {
      this.eventService.getEventsByStatus(20)
        .subscribe(res => {
          if (res.model) {
            this.setLimitedEvents(res.model);
          }
        });
    }
  }

  private setLimitedEvents(allEvents: EventModel[]) {
    const events = allEvents;
    if (events.length > 6) {
      this.events = events.splice(0, events.length - 1);
    } else {
      this.events = events;
    }
    this.isLoading = false;
  }

  private getAllEvents() {
    this.eventService.getAllEvents().subscribe(res => {
      this.events = res.model;
      this.isLoading = false;
    });
  }

  private searchEvents(filters: { name: string; region: number[]; type: number[]; status: number[] }) {
    this.eventService.searchEvents(filters).subscribe(res => {
      if (res) {
        console.log(res.model);
      }
    });
  }
}
