import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit, OnDestroy {
  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  constructor(private route: ActivatedRoute,
              private userProfileService: UserProfileService,
              private router: Router) {
  }

  ngOnInit() {
    this.checkUrl();
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
}
