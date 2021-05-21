import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/services/event.service';
import { EventModel } from '../../../infratructure/models/event.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalVarsService } from '../../../global-vars.service';
import { SelectOption } from '../../../infratructure/models/select-option.model';
import { TranslateService } from '@ngx-translate/core';
import { LocationInterface } from '../../../infratructure/interfaces/location.interface';
import { EventStatusesConstant } from '../../../infratructure/constants/event-statuses.constant';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-event-navigator',
  templateUrl: './event-navigator.component.html',
  styleUrls: ['./event-navigator.component.scss']
})
export class EventNavigatorComponent implements OnInit {
  filters: {
    name: string,
    region: number[],
    type: number[],
    status: number[]
  };
  allEvents: EventModel[];
  filtersForm: FormGroup;
  filteredEvents: EventModel[];
  allLocations: LocationInterface[];
  locationsOptions: SelectOption[];
  statuses = EventStatusesConstant;
  isLoading: boolean;
  eventTypesOptions: SelectOption[];
  statusesOptions: SelectOption[];

  constructor(private eventService: EventService,
              private globalVarsService: GlobalVarsService,
              private translateService: TranslateService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.initFiltersForm();
    this.getOptions();
    this.getAllEvents();
  }


  private getAllEvents() {
    this.eventService.getAllEvents()
      .subscribe(res => {
        if (res.model) {
          this.allEvents = res.model;
          this.filteredEvents = res.model;
          this.isLoading = false;
        }
      });
  }

  private initFiltersForm() {
    this.filtersForm = this.fb.group({
      name: [null],
      region: [null],
      type: [null],
      status: [null]
    });
    this.filters = {
      name: null,
      region: [],
      type: [],
      status: []
    };
    this.nameWatcher();
  }

  private nameWatcher() {
    this.filtersForm.get('name')
      .valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.filters.name = value;
        this.isLoading = true;
        this.setFilteredEvents(this.filters);
      });
  }

  private setFilteredEvents(filters: { name: string; region: number[]; type: number[]; status: number[] }) {
    this.isLoading = true;
    const events = this.allEvents;


    this.filteredEvents = events.map(event => {
      let isMatch: boolean;
      const isMatchArr = [false, false, false, false];
      if (filters.name) {
        const eventName = event.name.toLowerCase();
        const filterNam = filters.name.toLowerCase();
        if (eventName.search(filterNam) !== -1) {
          isMatchArr[0] = true;
        }
      } else {
        isMatchArr[0] = true;
      }
      if (filters.region.length) {
        filters.region.forEach(region => {
          if (event.region === region) {
            isMatchArr[1] = true;
          }
        });
      } else {
        isMatchArr[1] = true;
      }
      if (filters.type.length) {
        filters.type.forEach(type => {
          if (event.type === type) {
            isMatchArr[2] = true;
          }
        });
      } else {
        isMatchArr[2] = true;
      }
      if (filters.status.length) {
        filters.status.forEach(status => {
          if (event.status === status) {
            isMatchArr[3] = true;
          }
        });
      } else {
        isMatchArr[3] = true;
      }
      isMatch = isMatchArr[0] && isMatchArr[1] && isMatchArr[2] && isMatchArr[3];
      event['isMatch'] = isMatch;
      return event;
    });


    this.filteredEvents = this.filteredEvents.filter(e => e['isMatch']);
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  private getOptions() {
    this.globalVarsService.getEventTypes()
      .subscribe(res => {
        this.eventTypesOptions = res.model.map(item => {
          let typeName = null;
          this.translateService.get(`EVENT_TYPES.${item.label}`)
            .subscribe(message => {
              typeName = message;
            });
          return new SelectOption(typeName, +item.id);
        });
      });
    this.globalVarsService.getAllLocations()
      .subscribe(res => {
        if (res.model) {
          this.allLocations = res.model;
          this.locationsOptions = res.model.map(item => {
            return new SelectOption(item.name, +item.id);
          });
        }
      });
    this.statusesOptions = this.statuses.map(item => {
      let statusName = null;
      this.translateService.get(`EVENT_STATUSES.${item.label}`)
        .subscribe(message => {
          statusName = message;
        });
      return new SelectOption(statusName, +item.id);
    });
  }

  onFiltersApply() {
    this.isLoading = true;
    this.filters.region = this.filtersForm.get('region').value || [];
    this.filters.type = this.filtersForm.get('type').value || [];
    this.filters.status = this.filtersForm.get('status').value || [];
    this.setFilteredEvents(this.filters);
  }
}
