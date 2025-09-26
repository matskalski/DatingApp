import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountsService } from '../services/accounts/accounts-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountsService = inject(AccountsService);

  const user = accountsService.currentUser();

  if(user){
    //nie modyfikuje się orginalnego requestu
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${user.token}`
      }
    })
  }

  return next(req);
};
