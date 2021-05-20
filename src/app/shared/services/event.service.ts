import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventModel } from '../../infratructure/models/event.model';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private baseUrl = `${environment.host}/event`;

  constructor(private http: HttpClient) {
  }

  public createEvent(event: EventModel): Observable<any> {
    const url = `${this.baseUrl}/new`;

    return this.http.post(url, event);
  }

  public getAllEvents(): Observable<any> {
    const url = `${this.baseUrl}/getAll`;

    return this.http.get(url, {
      headers: this.headers
    });
  }

  public searchEvents(params): Observable<any> {
    const url = `${this.baseUrl}/search`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        name: params.name,
        type: params.type,
        status: params.status,
        region: params.region,
      }
    });
  }

  public updateEvent(event: EventModel): Observable<any> {
    const url = `${this.baseUrl}/update`;

    return this.http.put(url, event);
  }

  public getEventById(id: number): Observable<any> {
    const url = `${this.baseUrl}/getById`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        id: id.toString()
      }
    });
  }

  public getEventsByRegion(regionId: number): Observable<any> {
    const url = `${this.baseUrl}/getByRegion`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        regionId: regionId.toString()
      }
    });
  }

  public getEventsByType(typeId: number): Observable<any> {
    const url = `${this.baseUrl}/getByType`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        typeId: typeId.toString()
      }
    });
  }

  public getEventsByTypes(typeIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/getByTypes`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        typeIds: typeIds.toString()
      }
    });
  }

  public getEventsByStatus(statusId: number): Observable<any> {
    const url = `${this.baseUrl}/getByStatus`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        statusId: statusId.toString()
      }
    });
  }

  public getEventsByIds(eventIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/getByIds`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        eventIds: eventIds.toString()
      }
    });
  }

  public getEventsByUserId(userId: number): Observable<any> {
    const url = `${this.baseUrl}/getByUserId`;

    return this.http.get(url, {
      headers: this.headers,
      params: {
        userId: userId.toString()
      }
    });
  }

  public interestedToEvent(userId: number, eventId: number): Observable<any> {
    const url = `${this.baseUrl}/interested`;

    return this.http.put(url, {
      userId, eventId
    });
  }

  public unInterestedToEvent(userId: number, eventId: number): Observable<any> {
    const url = `${this.baseUrl}/unInterested`;

    return this.http.put(url, {
      userId, eventId
    });
  }


  public deleteEvent(id: number, isFormOrg: boolean, ownerId: number): Observable<any> {
    const url = `${this.baseUrl}/delete`;

    return this.http.delete(url, {
      headers: this.headers,
      params: {
        id: id.toString(),
        isFormOrg: isFormOrg.toString(),
        ownerId: ownerId.toString()
      }
    });
  }
}
