import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserCredentialsInterface } from '../infratructure/interfaces/user-credentials.interface';
import { UserInterface } from '../infratructure/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  private url = `${environment.host}/auth`;

  public signIn(credentials: UserCredentialsInterface): Observable<any> {
    const url = `${this.url}/login`;
    return this.http.post(url, credentials);
  }

  public checkByEmail(email: string): Observable<any> {
    const url = `${this.url}/checkbyemail`;
    return this.http.get(url, {
      headers: this.headers,
      params: {
        email
      }
    });
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  public getCurrentUser(): UserInterface {
    return JSON.parse(localStorage.getItem('loggedUser'));
  }

  public signOut(): void {
    localStorage.clear();
  }

  public signUp(newUser: UserInterface): Observable<any> {
    const url = `${this.url}/register`;
    return this.http.post(url, newUser);
  }
}
