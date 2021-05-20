import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { OrganizationService } from '../../../shared/services/organization.service';
import { OrganizationInterface } from '../../../infratructure/interfaces/organization.interface';
import { EventTypes } from '../../../infratructure/constants/event-type.const';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from '../../../infratructure/models/select-option.model';
import { TranslateService } from '@ngx-translate/core';
import { LocationInterface } from '../../../infratructure/interfaces/location.interface';
import { RegionsEnum } from '../../../infratructure/enums/regions.enum';
import { EventModel } from '../../../infratructure/models/event.model';
import { EventStatusesEnum } from '../../../infratructure/enums/event-statuses.enum';
import { EventService } from '../../../shared/services/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-add-edit',
  templateUrl: './event-add-edit.component.html',
  styleUrls: ['./event-add-edit.component.scss']
})
export class EventAddEditComponent implements OnInit, OnDestroy {
  currentUser: UserInterface;
  isLoading: boolean;
  isRouteFromOrg: boolean;
  isSelectTypeView: boolean;
  eventTypes = EventTypes;
  eventTypesOptions: SelectOption[];
  isCreateView: boolean;
  organizations: OrganizationInterface[];
  isSelectOrgView: boolean;
  selectedType: { label: string; id: number };
  form: FormGroup;
  submitted: boolean;
  allLocations: LocationInterface[];
  locationsOptions: SelectOption[];
  citiesOptions: SelectOption[];
  isYerevanSelected: boolean;
  selectedOrg: OrganizationInterface;

  private ngDestroy = new Subject();
  private currentEvent: EventModel;

  constructor(private globalVarsService: GlobalVarsService,
              private router: Router,
              private toastr: ToastrService,
              private translateService: TranslateService,
              private eventService: EventService,
              private fb: FormBuilder,
              private organizationService: OrganizationService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();
    this.checkRoute();
    this.getEventTypes();
    this.getLocations();
    this.getOrgFromService();
    this.getCurrentUserFormService();
  }

  ngOnDestroy(): void {
    this.ngDestroy.next(true);
    this.ngDestroy.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      type: [null, [Validators.required]],
      region: [null, [Validators.required]],
      city: [null, [Validators.required]],
      streetAndAddress: [null, [Validators.required, Validators.minLength(5)]],
      description: [null, [this.checkEditorMaxLength.bind(this), this.checkEditorMinLength.bind(this), Validators.required]],
      dateGroup: this.fb.group({
        startDate: [null, [Validators.required]],
        startTime: [{hour: null, minute: null, second: null}],
        endTime: [{hour: null, minute: null, second: null}],
        endDate: [null]
      }, {validator: this.validateDateGroup}),
    });
    this.regionWatcher();
    this.typeWatcher();
  }

  private regionWatcher() {
    this.form.get('region').valueChanges
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(value => {
        if (value) {
          this.form.get('city').reset();
          this.form.get('city').updateValueAndValidity();
          this.isYerevanSelected = value === RegionsEnum.Yerevan;
          this.setCityOptions(value);
        }
      });
  }

  private typeWatcher() {
    this.form.get('type').valueChanges
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(id => {
        if (id) {
          this.selectedType = this.eventTypes.find(t => t.id === id);
        }
      });
  }

  public validateDateGroup(formGpoup: FormGroup): { [key: string]: any } {
    const start = (formGpoup.controls['startDate'] as FormControl).value;
    const end = (formGpoup.controls['endDate'] as FormControl).value;

    if (start && end) {
      const startDateVal = new Date(start).valueOf();
      const endDateVal = new Date(end).valueOf();

      if (endDateVal < startDateVal) {
        return {range: true};
      }
    }
    return null;
  }

  private checkRoute(): void {
    this.route.url
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(url => {
        this.isLoading = true;
        this.isRouteFromOrg = url[0].path === 'create-org-event';
        this.isSelectTypeView = true;
      });
  }

  private getCurrentUserFormService() {
    this.globalVarsService.signedInUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
      this.queryParamSubscriber();
    });
  }

  private getOrgFromService() {
    this.globalVarsService.currentOrg.subscribe(org => {
      this.selectedOrg = org;
    });
  }

  private queryParamSubscriber() {
    this.route.queryParams.subscribe(params => {
      if (params['selectOrg']) {
        this.isSelectOrgView = true;
        this.isRouteFromOrg = true;
        this.isSelectTypeView = false;
        this.getUserOrgs();
      }
    });
  }

  private getUserOrgs() {
    this.organizationService.getOrgsById(this.currentUser.orgIds).subscribe(res => {
      this.organizations = res.model;
    });
  }

  onCreateFromMyProfile() {
    this.isRouteFromOrg = false;
    this.isSelectOrgView = false;
    this.isSelectTypeView = true;
  }

  onTypeSelect(type: { label: string, id: number }) {
    this.isSelectTypeView = false;
    this.isCreateView = true;
    this.selectedType = type;
    this.form.get('type').setValue(type.id);
  }

  changeTypePhotoTheme(aeTheme: boolean, type: { label: string, id: number }) {
    const img = document.getElementById(String(type.id));
    const theme = aeTheme ? '_' : '';
    const src = 'assets/images/types/' + type.label + theme + '.jpg';
    img.setAttribute('src', src);
  }

  onBackToTypeSelect() {
    this.isCreateView = false;
    this.isSelectTypeView = true;
  }

  private getEventTypes(): void {
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
  }

  public checkEditorMaxLength(control: AbstractControl) {
    if (control.value) {
      // check text length in html context
      if (control.value.replace(/<\/?[^>]+>/gi, '').length > 2000) {
        return {maxlength: true};
      }
      return null;
    }
    return null;
  }

  public checkEditorMinLength(control: AbstractControl) {
    if (control.value) {
      // check text length in html context
      if (control.value.replace(/<\/?[^>]+>/gi, '').length < 30) {
        return {minlength: true};
      }
      return null;
    }
    return null;
  }

  private getLocations(): void {
    this.globalVarsService.getAllLocations()
      .subscribe(res => {
        if (res.model) {
          this.allLocations = res.model;
          this.locationsOptions = res.model.map(item => {
            return new SelectOption(item.name, +item.id);
          });
        }
      });
  }

  private setCityOptions(regId: number) {
    const reg = this.allLocations.find(l => l.id === regId);
    this.citiesOptions = reg.regCity.map(item => {
      return new SelectOption(item.name, +item.id);
    });
  }


  onCreateClick() {
    this.submitted = true;
    if (this.form.valid) {
      const values = this.form.value;
      const region = this.locationsOptions.find(r => r.value === values.region);
      const city = this.citiesOptions.find(c => c.value === values.city);

      const model = new EventModel(0);
      model.name = values.name;
      model.type = values.type;
      model.photoUrl = 'assets/images/types/' + this.selectedType.label + '.jpg';
      model.typeName = this.selectedType.label;
      model.region = values.region;
      model.regionName = region.label;
      model.city = values.city;
      model.cityName = city.label;
      model.streetAndAddress = values.streetAndAddress;
      model.description = values.description;
      model.startDate = values.dateGroup.startDate;
      model.endDate = values.dateGroup.endDate;
      model.startTime = values.dateGroup.startTime;
      model.endTime = values.dateGroup.endTime;
      model.interestedUserIds = [];
      model.isClosed = false;
      model.isCanceled = false;
      model.isFromOrg = this.isRouteFromOrg;
      model.statusName = 'Upcoming';
      model.status = EventStatusesEnum.Upcoming;
      if (this.isRouteFromOrg) {
        model.orgId = this.selectedOrg.id;
      } else {
        model.userId = this.currentUser.id;
      }
      this.createEvent(model);
    }
  }

  onCreateFormOrg(organization: OrganizationInterface) {
    this.isSelectTypeView = true;
    this.selectedOrg = organization;
  }

  private createEvent(model: EventModel) {
    this.eventService.createEvent(model)
      .subscribe(res => {
        if (res.model) {
          this.currentEvent = res.model;
          if (this.currentEvent.isFromOrg) {
            this.showNotificationMessage('NOTIFY_MESSAGES.event_created', {value: this.currentEvent.name});
            this.router.navigate(['/organizations', this.selectedOrg.id, 'created-events', 'all']);
          }
        }
      });
  }

  private showNotificationMessage(key: string, params?: object): void {
    this.translateService.get(key, params)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }
}
