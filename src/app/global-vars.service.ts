import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  public currentLanguage = new BehaviorSubject<number>(1);

  constructor() {
  }
}
