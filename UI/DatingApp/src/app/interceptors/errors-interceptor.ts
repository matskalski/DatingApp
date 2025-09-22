import { SnackbarService } from './../services/snackbar/snackbar-service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

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

              //snackbarService.error("400");
              break
            case 401:
              snackbarService.error("401");
              break
            case 404:
              snackbarService.error("404")
              break
            case 500:
              snackbarService.error("500")
              break
            default:
              break
          }
        }

        throw err;
      })
    );
};
