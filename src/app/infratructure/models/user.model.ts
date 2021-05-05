export class UserModel {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public isSocial: boolean;
  public photoUrl: string;

  constructor(id: number) {
  }
}
