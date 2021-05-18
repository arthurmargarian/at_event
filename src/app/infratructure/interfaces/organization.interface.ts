export interface OrganizationInterface {
  id: number;
  ownerId: number;
  name: string;
  about: string;
  photoUrl: string;
  contactNumber: number;
  address: string;
  contactEmail: string;
  eventIds: number[];
  followerIds: number[];
  orgEventTypeIds: number[];
}
