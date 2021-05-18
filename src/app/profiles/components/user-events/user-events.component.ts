import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { Title } from '@angular/platform-browser';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit, OnDestroy {
  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  private ngUnsubscribe: Subject<boolean> = new Subject();
  public currentUser: UserInterface;

  constructor(private route: ActivatedRoute,
              private userProfileService: UserProfileService,
              private router: Router) {
  }

  ngOnInit() {
    this.checkUrl();
    this.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private checkUrl(): void {
    this.route.url
      .subscribe((url) => {
        const paths = this.router.url.split('/');
        if (paths.length === 4) {
          this.router.navigate([this.router.url + '/all']);
        }
      });
  }

  private getCurrentUser(): void {
    this.userProfileService.currentUser
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = null;
        }
      });
  }
}
