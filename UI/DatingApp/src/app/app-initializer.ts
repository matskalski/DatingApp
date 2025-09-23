import { inject } from "@angular/core";
import { LocalStorageService } from "./services/localStorage/local-storage-service";
import { AccountsService } from "./services/accounts/accounts-service";
import { UserModel } from "./models/user-model";

export const initializeApp = () => {
  const localStorageService = inject(LocalStorageService);
  const accountsService = inject(AccountsService);

  let user = localStorageService.getItemAsObject<UserModel>("user");

  if(user){
    accountsService.currentUser.set(user)
  }
}
