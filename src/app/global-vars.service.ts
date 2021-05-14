import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from './infratructure/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  public currentLanguage = new BehaviorSubject<number>(1);
  public signedInUser = new BehaviorSubject<UserInterface>(null);

  constructor() {
    this.signedInUser.next(JSON.parse(localStorage.getItem('user')));
  }
}
