import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.scss']
})
export class EventsGridComponent implements OnInit {
  public currentTab: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.checkUrl();
  }

  private checkUrl(): void {
    const paths = this.router.url.split('/');
    console.log(paths);
    switch (paths[1]) {
      case 'profile':
        const isCreatedEvents = paths[3] === 'created-events';
        this.setProfileEvents(isCreatedEvents, paths[4]);
        break;
    }
  }

  private setProfileEvents(isCreatedEvents: boolean, tab: string) {
    console.log(tab);
    this.currentTab = tab;
  }
}
