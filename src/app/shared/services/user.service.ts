import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserModel } from '../../infratructure/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private url = `${environment.host}/user`;

  constructor(private http: HttpClient) {
  }

  public getUserById(id: number): Observable<any> {
    return this.http.get(`${this.url}/getUserById`, {
      headers: this.headers,
      params: {
        id: id.toString()
      }
    });
  }

  public getUsersById(followerIds: number[]): Observable<any> {
    return this.http.get(`${this.url}/getUsersById`, {
      headers: this.headers,
      params: {
        userIds: followerIds.toString()
      }
    });
  }

  public followToUser(followerId: number, followingId: number): Observable<any> {
    return this.http.put(`${this.url}/followToUser`, {
      followerId, followingId
    });
  }

  public unFollowToUser(followerId: number, followingId: number): Observable<any> {
    return this.http.put(`${this.url}/unFollowToUser`, {
      followerId, followingId
    });
  }

  updateUserInfo(model: UserModel): Observable<any> {
    return this.http.put(`${this.url}/updateUserById`, model);
  }

  updateUserInterests(userId: number, eventTypeIds: number[]): Observable<any> {
    return this.http.post(`${this.url}/updateUserInterests`, {userId, eventTypeIds});
  }
}
