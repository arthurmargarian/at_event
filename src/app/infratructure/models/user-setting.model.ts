import { LanguageEnum } from '../enums/language.enum';

export class UserSettingModel {
  constructor(public id: number, public language: LanguageEnum) {
  }
}
