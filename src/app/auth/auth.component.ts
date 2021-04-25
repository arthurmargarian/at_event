import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public isLoginPage = true;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.navigate(['sign-in']);
    this.routerSubscriber();
  }

  private routerSubscriber() {
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isLoginPage = event.url === '/sign-in';
        }
      });
  }
}
