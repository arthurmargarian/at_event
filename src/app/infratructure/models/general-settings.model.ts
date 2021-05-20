export class GeneralSettingsModel {
    constructor(
        public countryId?: number,
        public currencyId?: number,
        public dateFormat?: string,
        public startOfWeek?: number,
    ) {

    }
}
