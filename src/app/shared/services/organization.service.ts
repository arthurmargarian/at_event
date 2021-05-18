import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrganizationInterface } from '../../infratructure/interfaces/organization.interface';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseUrl = `${environment.host}/organization`;

  constructor(private http: HttpClient) {
  }

  public addNewOrganization(organization: OrganizationInterface): Observable<any> {
    const url = `${this.baseUrl}/newOrganization`;
    return this.http.post(url, organization);
  }

  public updateOrganization(organization: OrganizationInterface): Observable<any> {
    const url = `${this.baseUrl}/updateOrganization`;

    return this.http.put(url, organization);
  }

  public getOrgById(id: number): Observable<any> {
    const url = `${this.baseUrl}/getOrganizationById`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        id: id.toString()
      }
    });
  }

  public getOrgsById(orgIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/getOrganizationsById`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        orgIds: orgIds.toString()
      }
    });
  }

  public followToOrg(followerId: number, orgId: number): Observable<any> {
    const url = `${this.baseUrl}/followToOrganization`;

    return this.http.put(url, {
      followerId, orgId
    });
  }

  public unFollowToOrg(followerId: number, orgId: number): Observable<any> {
    const url = `${this.baseUrl}/unFollowToOrganization`;

    return this.http.put(url, {
      followerId, orgId
    });
  }


  public deleteOrg(id: number, ownerId: number): Observable<any> {
    const url = `${this.baseUrl}/deleteOrgById`;
    return this.http.delete(url, {
      headers: this.headers,
      params: {
        id: id.toString(),
        ownerId: ownerId.toString()
      }
    });
  }
}
