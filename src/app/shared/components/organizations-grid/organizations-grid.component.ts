import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrganizationInterface } from '../../../infratructure/interfaces/organization.interface';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../profiles/services/user-profile.service';
import { OrganizationService } from '../../services/organization.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventTypes } from '../../../infratructure/constants/event-type.const';

@Component({
  selector: 'app-organizations-grid',
  templateUrl: './organizations-grid.component.html',
  styleUrls: ['./organizations-grid.component.scss']
})
export class OrganizationsGridComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  public currentUser: UserInterface;
  public organizations: OrganizationInterface[];
  public eventTypes = EventTypes;
  private isYourOrgsTab: boolean;
  private ngDestroy = new Subject();

  constructor(private route: ActivatedRoute,
              private organizationService: OrganizationService,
              private userProfileService: UserProfileService) {
  }

  ngOnInit() {
    this.checkRoute();
  }

  ngOnDestroy(): void {
    this.ngDestroy.next(true);
    this.ngDestroy.complete();
  }

  private checkRoute(): void {
    this.route.url
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(url => {
        this.isLoading = true;
        this.isYourOrgsTab = url[0].path === 'your';
        this.getCurrentUserFormService(this.isYourOrgsTab);
      });
  }

  private getCurrentUserFormService(isYourOrgsTab: boolean): void {
    this.userProfileService.currentUser
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          const orgIds = isYourOrgsTab ? this.currentUser.orgIds : this.currentUser.followingOrgIds;
          this.getOrgs(orgIds);
        }
      });
  }

  private getOrgs(orgIds: number[]): void {
    this.organizationService.getOrgsById(orgIds)
      .subscribe(res => {
        if (res.model) {
          this.organizations = res.model;
          this.isLoading = false;
        }
      });
  }

  public getEventTypeLabel(typeId: number): string {
    const type = this.eventTypes.find(t => t.id === typeId);
    return type.label;
  }
}
