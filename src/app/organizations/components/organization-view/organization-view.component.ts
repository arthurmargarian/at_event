import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../shared/services/organization.service';
import { OrganizationModel } from '../../../infratructure/models/organization.model';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { EventTypes } from '../../../infratructure/constants/event-type.const';
import { UserService } from '../../../shared/services/user.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: ['./organization-view.component.scss']
})
export class OrganizationViewComponent implements OnInit, OnDestroy {
  @ViewChild('signInModal') public signInModal: ModalDirective;
  isLoading: boolean;
  currentOrg: OrganizationModel;
  eventTypes = EventTypes;
  canFollow = true;
  signedUserId = JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).id;
  signedUser: UserInterface;

  constructor(private route: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private toastr: ToastrService,
              private userService: UserService,
              private globalVarsService: GlobalVarsService,
              private organizationService: OrganizationService) {
  }

  ngOnInit() {
    this.routerParamSubscriber();
  }

  ngOnDestroy(): void {
    this.globalVarsService.currentOrg.next(null);
  }

  private routerParamSubscriber(): void {
    this.route.params.subscribe(params => {
      const orgId = +params['id'];
      this.getOrgById(orgId);
    });
  }

  private getOrgById(orgId: number) {
    this.isLoading = true;
    this.organizationService.getOrgById(orgId).subscribe(res => {
      if (res.model) {
        this.currentOrg = res.model;
        this.titleService.setTitle(`At Event | ${this.currentOrg.name}`);
        this.globalVarsService.currentOrg.next(res.model);
        if (this.signedUserId) {
          this.getSignedUser();
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  public onFollowClick(): void {
    if (this.signedUser) {
      this.followToOrg();
    } else {
      this.signInModal.show();
    }
  }

  public onHideSignInModal(): void {
    this.signInModal.hide();
  }

  public followToOrg() {
    this.organizationService.followToOrg(this.signedUser.id, this.currentOrg.id).subscribe(res => {
      this.showNotificationMessage('NOTIFY_MESSAGES.follow', {value: this.currentOrg.name});
      this.getOrgById(this.currentOrg.id);
    });
  }

  onUnFollowClick() {
    this.organizationService.unFollowToOrg(this.signedUser.id, this.currentOrg.id).subscribe(res => {
      this.showNotificationMessage('NOTIFY_MESSAGES.unfollow', {value: this.currentOrg.name});
      this.getOrgById(this.currentOrg.id);
    });
  }

  private getSignedUser() {
    this.userService.getUserById(this.signedUserId).subscribe(res => {
      this.signedUser = res.model;
      this.checkFollow();
      this.isLoading = false;
    });
  }

  public getEventTypeLabel(typeId: number): string {
    const type = this.eventTypes.find(t => t.id === typeId);
    return type.label;
  }

  private checkFollow(): void {
    const isFollow = this.signedUser.followingOrgIds.find(id => id === this.currentOrg.id);
    this.canFollow = !isFollow;
  }

  private showNotificationMessage(key: string, params: object): void {
    this.translateService.get(key, params)
      .subscribe(message => {
        this.toastr.success(message, '', {positionClass: 'toast-bottom-right', progressBar: true, progressAnimation: 'decreasing'});
      });
  }


}
