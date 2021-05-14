import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../../profiles/services/user-profile.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss']
})
export class UsersGridComponent implements OnInit {
  public currentUser: UserInterface;
  public users: UserInterface[];
  public isLoading: boolean;
  public isFollowersTab: boolean;

  constructor(private route: ActivatedRoute,
              private userProfileService: UserProfileService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.checkRoute();
  }

  private checkRoute(): void {
    this.route.url.subscribe(url => {
      this.isLoading = true;
      this.isFollowersTab = url[0].path === 'followers';
      this.getCurrentUserFormService(this.isFollowersTab);
    });
  }

  private getCurrentUserFormService(isFollowersTab: boolean): void {
    this.userProfileService.currentUser
      .subscribe(user => {
        this.currentUser = user;
        const userIds = isFollowersTab ? this.currentUser.followerIds : this.currentUser.followingUserIds;
        this.getUsers(userIds);
      });
  }

  private getUsers(usersIds: number[]): void {
    this.userService.getUsersById(usersIds)
      .subscribe(res => {
        if (res.model) {
          this.users = res.model;
          this.isLoading = false;
          console.log(this.users);
        }
      });
  }
}
