import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading/loading-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>()

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if(req.method === 'GET'){
    const cachedResp = cache.get(req.url);
    if(cachedResp){
        return of(cachedResp);
    }
  }

  loadingService.busy();

  return next(req).pipe(
    delay(500),
    tap(resp => {
      cache.set(req.url, resp)
    }),
    finalize(() => {
      loadingService.idle();
    })
  );
};
