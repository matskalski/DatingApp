import { SnackbarService } from './../services/snackbar/snackbar-service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);
  const router = inject(Router);

  return next(req)
    .pipe(
      catchError(err => {
        if (err) {
          switch (err.status) {
            case 400:
              if (err.error.errors) {
                const modelStateErrors = [];
                for (const key in err.error.errors) {
                  if (err.error.errors[key]) {
                    modelStateErrors.push(err.error.errors[key])
                  }
                }
                throw modelStateErrors.flat()
              }
              else {
                snackbarService.error(err.error, err.status)
              }
              break
            case 401:
              snackbarService.error("401");
              break
            case 404:
              router.navigateByUrl('/not-found')
              break
            case 500:
              console.log('server error')
              const navigationExtras: NavigationExtras = {state: {error: err.error}}
              router.navigateByUrl('/server-error', navigationExtras)
              break
            default:
              break
          }
        }

        throw err;
      })
    );
};
