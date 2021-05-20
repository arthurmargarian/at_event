export class EventModel {
  public id: number;
  public orgId: number;
  public userId: number;
  public name: string;
  public type: number;
  public photoUrl: string;
  public typeName: string;
  public region: number;
  public regionName: string;
  public city: number;
  public cityName: string;
  public status: number;
  public statusName: string;
  public isClosed: boolean;
  public isCanceled: boolean;
  public isFromOrg: boolean;
  public streetAndAddress: string;
  public description: string;
  public startDate: Date;
  public startTime: { hour: number, minute: number, second: number };
  public endDate: Date;
  public endTime: { hour: number, minute: number, second: number };
  public interestedUserIds: number[];

  constructor(id: number) {
    this.id = id;
  }
}
