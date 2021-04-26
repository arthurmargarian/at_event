import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserSettingModel } from '../../infratructure/models/user-setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  private url = `${environment.host}/settings`;

  public setUserSettings(userSetting: UserSettingModel): Observable<any> {
    return this.http.post(this.url, userSetting);
  }

  public getUserSettings(userId: number): Observable<any> {
    return this.http.get(this.url, {
      headers: this.headers,
      params: {
        id: userId.toString()
      }
    });
  }
}
