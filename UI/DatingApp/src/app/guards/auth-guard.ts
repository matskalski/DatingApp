import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountsService } from '../services/accounts/accounts-service';
import { SnackbarService } from '../services/toast/snackbar-service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountsService = inject(AccountsService);
  const snackbarService = inject(SnackbarService);
  const router = inject(Router)

  if(accountsService.currentUser()){
    return true;
  }

  snackbarService.warning("Tylko zalogowani użytkownicy mogą przejść pod ten adres. Zostałeś przekierowany na stronę domową");
  router.navigate(['/home']);

  return false;
};
