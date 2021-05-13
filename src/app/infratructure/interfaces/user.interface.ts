export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSocial: boolean;
  photoUrl: string;
  fullName?: string;
  contactNumber?: string;
  contactEmail?: string;
  activeOrgId?: number;
  orgIds?: [];
  eventIds?: [];
  followerIds?: [];
  interestedTypeIds?: [];
  followingUserIds?: [];
  followingOrgIds?: [];
  followingEventIds?: [];
}
