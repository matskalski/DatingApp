import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginModel } from '../../models/login-model';
import { UserModel } from '../../models/user-model';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../localStorage/local-storage-service';
import { RegisterModel } from '../../models/register-model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  currentUser = signal<UserModel | null>(null)

  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private baseUrl = 'https://localhost:7144/api/';

  login(loginModel: LoginModel) {
    return this.http.post<UserModel>(this.baseUrl + 'accounts/login', loginModel)
      .pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      )
  }

  logout() {
    this.localStorageService.removeItem('user')
    this.currentUser.set(null)
  }

  register(registerModel: RegisterModel) {
    return this.http.post<UserModel>(this.baseUrl + 'accounts/register', registerModel)
    .pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      )
  }

  private setCurrentUser(user: UserModel) {
    this.localStorageService.setItem('user', user);
    this.currentUser.set(user)
  }
}
