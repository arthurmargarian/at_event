import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public atEventPhotoUrl = 'assets/images/ae-icon.ico';

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  public scrollToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  public changeAtEventPhoto(isHover: boolean): void {
    this.atEventPhotoUrl = isHover ? 'assets/images/ae-white.png' : 'assets/images/ae-icon.png';
  }

  onNavigateDashboard() {
    this.router.navigate(['dashboard']);
  }
}
