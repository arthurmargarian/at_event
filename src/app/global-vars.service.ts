import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInterface } from './infratructure/interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { OrganizationInterface } from './infratructure/interfaces/organization.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  public isAuthenticated = new BehaviorSubject<boolean>(false);
  public currentLanguage = new BehaviorSubject<number>(1);
  public signedInUser = new BehaviorSubject<UserInterface>(null);
  public currentOrg = new BehaviorSubject<OrganizationInterface>(null);
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private url = `${environment.host}/values`;

  constructor(private http: HttpClient) {
    this.signedInUser.next(JSON.parse(localStorage.getItem('user')));
  }

  public getEventTypes(): Observable<any> {
    return this.http.get(`${this.url}/getEventTypes`, {
      headers: this.headers
    });
  }
}
