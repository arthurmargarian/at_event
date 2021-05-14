import { Component, OnInit } from '@angular/core';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';

@Component({
  selector: 'app-events-for-you',
  templateUrl: './events-for-you.component.html',
  styleUrls: ['./events-for-you.component.scss']
})
export class EventsForYouComponent implements OnInit {
  private currentUser: UserInterface;

  constructor(private globalVarsService: GlobalVarsService) {
  }

  ngOnInit() {
    this.getSignedUserFromService();
  }

  private getSignedUserFromService() {
    this.globalVarsService.signedInUser
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.checkUserInterests(this.currentUser.interestedTypeIds);
        }
      });
  }

  private checkUserInterests(interestedTypeIds: number[]) {
    if (interestedTypeIds.length) {
      this.getEventsByType(interestedTypeIds);
    } else {
      alert('shoiw pop up');
    }
  }

  private getEventsByType(interestedTypeIds: number[]): void {
    console.log('asdgetEventsByType');
  }
}
