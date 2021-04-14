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

  private url = `${environment.host}/auth`;

  public test(): Observable<any> {
    const url = `${this.url}/register`;
    return this.http.post(url, {
      first_name: 'req.body.first_name',
      last_name: 'req.body.last_name',
      email: 'req.body.email',
      password: 'req.body.password',
    });
  }
}
