import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public currentUser: UserInterface;
  public isLoading: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getUserIdFromRoute();
  }

  private getUserIdFromRoute(): void {
    this.route.params
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
          console.log(this.currentUser);
        }
      });
  }
}
