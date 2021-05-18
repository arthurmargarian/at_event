export class OrganizationModel {
  public id: number;
  public ownerId: number;
  public name: string;
  public about: string;
  public photoUrl: string;
  public contactNumber: number;
  public address: string;
  public contactEmail: string;
  public eventIds: number[];
  public followerIds: number[];
  public orgEventTypeIds: number[];

  constructor(id: number) {
    this.id = id;
  }
}
