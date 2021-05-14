export class UserModel {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public isSocial: boolean;
  public photoUrl: string;
  public fullName?: string;
  public activeOrgId?: number;
  public contactNumber?: string;
  public contactEmail?: string;
  public orgIds?: number[];
  public eventIds?: number[];
  public followerIds?: number[];
  public interestedTypeIds?: number[];
  public followingEventIds?: number[];
  public followingUserIds?: number[];
  public followingOrgIds?: number[];
  constructor(id: number) {
  }
}
