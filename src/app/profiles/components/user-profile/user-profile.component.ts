import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { GlobalVarsService } from '../../../global-vars.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('signInModal') public signInModal: ModalDirective;
  public currentUser: UserInterface;
  public isLoading: boolean;
  public canFollow: boolean;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public signedUser: UserInterface;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              private userProfileService: UserProfileService,
              private globalVarsService: GlobalVarsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getUserIdFromRoute();
    this.getSignedUserFromService();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getUserIdFromRoute(): void {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        const userId = +params['id'];
        if (userId) {
          this.isLoading = true;
          this.getUserById(userId);
        }
      });
  }

  private getUserById(userId: number): void {
    this.userService.getUserById(userId)
      .subscribe(res => {
        if (res.model) {
          this.currentUser = res.model;
          this.isLoading = false;
          this.titleService.setTitle(`At Event | ${this.currentUser.fullName}`);
          this.userProfileService.currentUser.next(this.currentUser);
          if (this.signedUser) {
            this.checkFollow();
          }
        }
      });
  }

  private getSignedUserFromService() {
    this.globalVarsService.signedInUser
      .subscribe(user => {
        this.signedUser = user;
      });
  }

  public onFollowClick(): void {
    if (this.signedUser) {
      this.followToUser(this.signedUser.id, this.currentUser.id);
    } else {
      this.signInModal.show();
    }
  }

  public onUnFollowClick(): void {
    this.unFollowToUser(this.signedUser.id, this.currentUser.id);
  }

  public onHideSignInModal(): void {
    this.signInModal.hide();
  }

  public followToUser(followerId: number, followingId: number): void {
    this.userService.followToUser(followerId, followingId)
      .subscribe(res => {
        if (res) {
          this.updateView();
        }
      });
  }

  public unFollowToUser(followerId: number, followingId: number): void {
    this.userService.unFollowToUser(followerId, followingId)
      .subscribe(res => {
        if (res) {
          this.updateView();
        }
      });
  }

  private updateView(): void {
    this.getUserById(this.currentUser.id);
  }

  private checkFollow(): void {
    const isFollow = this.currentUser.followerIds.find(id => id === this.signedUser.id);
    this.canFollow = !isFollow;
  }
}
