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
  public orgIds?: [];
  public eventIds?: [];
  public followerIds?: [];
  public interestedTypeIds?: [];
  public followingEventIds?: [];
  public followingUserIds?: [];
  public followingOrgIds?: [];
  constructor(id: number) {
  }
}
