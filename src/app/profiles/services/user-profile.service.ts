import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../../infratructure/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  public currentUser = new BehaviorSubject<UserInterface>(null);

  constructor(private http: HttpClient) {
  }
}
