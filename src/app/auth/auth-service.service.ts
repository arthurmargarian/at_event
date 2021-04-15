import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  private url = `${environment.host}/auth/`;

  public signIn(credentials): Observable<any> {
    const url = this.url + 'login';
    return this.http.post(url, credentials);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
