import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorsInterceptor } from './interceptors/errors-interceptor';
import { initializeApp } from './app-initializer';
import { jwtInterceptor } from './interceptors/jwt-interceptor';
import { loadingInterceptor } from './interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([
        errorsInterceptor,
        jwtInterceptor,
        loadingInterceptor
      ])
    ),
    provideAppInitializer(initializeApp)
  ]
};
