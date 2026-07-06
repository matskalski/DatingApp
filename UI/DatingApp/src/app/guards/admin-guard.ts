import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountsService } from '../services/accounts/accounts-service';
import { SnackbarService } from '../services/snackbar/snackbar-service';

export const adminGuard: CanActivateFn = () => {
  const accountsService = inject(AccountsService);
  const snackbarService = inject(SnackbarService);

  var roles = accountsService.currentUser()?.roles;

  if(roles?.includes('Admin') || roles?.includes('Moderator')){
    return true
  }
  else{
    snackbarService.error("You cannot enter this area");
    return false;
  }  
};
