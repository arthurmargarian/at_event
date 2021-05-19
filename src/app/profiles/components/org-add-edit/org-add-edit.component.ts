import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../infratructure/validators/email-validator';
import { GlobalVarsService } from '../../../global-vars.service';
import { SelectOption } from '../../../infratructure/models/select-option.model';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationModel } from '../../../infratructure/models/organization.model';
import { UserProfileService } from '../../services/user-profile.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { OrganizationService } from '../../../shared/services/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { OrganizationInterface } from '../../../infratructure/interfaces/organization.interface';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-org-add-edit',
  templateUrl: './org-add-edit.component.html',
  styleUrls: ['./org-add-edit.component.scss']
})
export class OrgAddEditComponent implements OnInit {
  @ViewChild('deleteConfirmModal') public deleteConfirmModal: ModalDirective;
  public isLoading: boolean;
  public form: FormGroup;
  public submitted: boolean;
  public eventTypes: SelectOption[];
  public orgDefaultPic: string;
  public currentUser: UserInterface;
  public currentOrg: OrganizationInterface;
  public isEditMode: boolean;
  private currentOrgId: number;

  constructor(private fb: FormBuilder,
              private userProfileService: UserProfileService,
              private organizationService: OrganizationService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private userService: UserService,
              private translateService: TranslateService,
              private globalVarsService: GlobalVarsService) {
  }

  ngOnInit() {
    this.getCurrentUserFromService();
    this.initForm();
    this.getOrgIdFromRoute();
    this.getEventTypes();
  }

  private getOrgIdFromRoute(): void {
    this.route.params
      .subscribe(params => {
        if (params['orgId']) {
          this.currentOrgId = params['orgId'];
          this.isEditMode = true;
          this.isLoading = true;
          this.getCurrentOrg(this.currentOrgId);
        } else {
          this.isEditMode = false;
        }
      });
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      contactNumber: [null, [Validators.required, Validators.minLength(5)]],
      contactMail: [null, [Validators.required, EmailValidator]],
      address: [null, [Validators.required]],
      eventTypes: [null, [Validators.required]],
      about: [null, [Validators.required]],
    });
  }

  private getEventTypes() {
    this.globalVarsService.getEventTypes()
      .subscribe(res => {
        this.eventTypes = res.model.map(item => {
          let typeName = null;
          this.translateService.get(`EVENT_TYPES.${item.label}`)
            .subscribe(message => {
              typeName = message;
            });
          return new SelectOption(typeName, +item.id);
        });
      });
  }

  public createSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      const values = this.form.value;
      const model = new OrganizationModel(0);
      model.ownerId = this.currentUser.id;
      model.name = values.name;
      model.about = values.about;
      model.photoUrl = this.orgDefaultPic;
      model.contactNumber = values.contactNumber;
      model.address = values.address;
      model.contactEmail = values.contactMail;
      model.eventIds = [];
      model.followerIds = [];
      model.orgEventTypeIds = values.eventTypes;
      this.createOrg(model);
    }
  }

  private getCurrentUserFromService() {
    this.userProfileService.currentUser
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  private createOrg(model: OrganizationModel) {
    this.organizationService.addNewOrganization(model)
      .subscribe(res => {
        if (res.success) {
          this.isLoading = false;
          this.showNotificationMessage('NOTIFY_MESSAGES.new_org_created');
          this.getUserById(this.currentUser.id);
        }
      });
  }

  private getUserById(userId: number): void {
    this.userService.getUserById(userId)
      .subscribe(res => {
        if (res.model) {
          this.userProfileService.currentUser.next(res.model);
          this.router.navigate(['profile', this.currentUser.id, 'organizations', 'your']);
        }
      });
  }

  private showNotificationMessage(key: string, params?): void {
    this.translateService.get(key, params)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }

  private getCurrentOrg(currentOrgId: number) {
    this.organizationService.getOrgById(currentOrgId).subscribe(res => {
      if (res.model) {
        this.currentOrg = res.model;
        this.patchForm(this.currentOrg);
      }
    });
  }

  private patchForm(currentOrg: OrganizationInterface) {
    this.form.setValue({
      name: currentOrg.name,
      contactNumber: currentOrg.contactNumber,
      contactMail: currentOrg.contactEmail,
      address: currentOrg.address,
      eventTypes: currentOrg.orgEventTypeIds,
      about: currentOrg.about,
    });
    this.isLoading = false;
  }

  updateSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      const values = this.form.value;
      const model = new OrganizationModel(this.currentOrg.id);
      model.ownerId = this.currentUser.id;
      model.name = values.name;
      model.about = values.about;
      model.photoUrl = this.orgDefaultPic;
      model.contactNumber = values.contactNumber;
      model.address = values.address;
      model.contactEmail = values.contactMail;
      model.eventIds = this.currentOrg.eventIds;
      model.followerIds = this.currentOrg.followerIds;
      model.orgEventTypeIds = values.eventTypes;
      this.updateOrg(model);
    }
  }

  private updateOrg(model: OrganizationModel) {
    this.organizationService.updateOrganization(model).subscribe(res => {
      if (res) {
        this.showNotificationMessage('NOTIFY_MESSAGES.org_updated');
        this.router.navigate(['profile', this.currentUser.id, 'organizations', 'your']);
      }
    });
  }

  public onDeleteClick(): void {
    this.deleteConfirmModal.show();
  }

  public onHideModal(): void {
    this.deleteConfirmModal.hide();
  }

  onDeleteConfirmed(): void {
    this.organizationService.deleteOrg(this.currentOrg.id, this.currentOrg.ownerId).subscribe(res => {
      if (res) {
        this.showNotificationMessage('NOTIFY_MESSAGES.org_deleted', {value: this.currentOrg.name});
        this.router.navigate(['profile', this.currentUser.id, 'organizations', 'your']);
      }
    });
  }
}
