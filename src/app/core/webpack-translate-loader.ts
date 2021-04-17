import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang === 'en') {
      // @ts-ignore
      return from(import('../../assets/i18n/en-US.json'));
    }
    // @ts-ignore
    return from(import('../../assets/i18n/hy-AM.json'));
  }
}
