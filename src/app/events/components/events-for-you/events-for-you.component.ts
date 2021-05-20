import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalVarsService } from '../../../global-vars.service';
import { UserInterface } from '../../../infratructure/interfaces/user.interface';
import { ModalDirective } from 'ngx-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-events-for-you',
  templateUrl: './events-for-you.component.html',
  styleUrls: ['./events-for-you.component.scss']
})
export class EventsForYouComponent implements OnInit {
  currentUser: UserInterface;
  @ViewChild('interestsModal') public interestsModal: ModalDirective;

  constructor(private globalVarsService: GlobalVarsService, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('At Event | For You');
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
    if (!interestedTypeIds.length) {
      setTimeout(() => {
        this.interestsModal.show();
      }, 300);
    }
  }

  onHideInterestsModalModal() {
    this.interestsModal.hide();
  }

  setInterestsClick() {
    this.interestsModal.show();
  }
}
