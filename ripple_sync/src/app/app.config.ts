import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials-interceptor';
import { refreshTokenInterceptor } from './interceptors/refresh-token-interceptor';
import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDa);
registerLocaleData(localeEn);
registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor, refreshTokenInterceptor])),
    { provide: LOCALE_ID, useFactory: () => navigator.language == "en-US" ? "en-GB" : navigator.language }
  ]
};
