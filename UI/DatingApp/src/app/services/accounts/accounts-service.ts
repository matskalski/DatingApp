import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginModel } from '../../models/login-model';
import { UserModel } from '../../models/user-model';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from '../localStorage/local-storage-service';
import { RegisterModel } from '../../models/register-model';
import { of } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  currentUser = signal<UserModel | null>(null)

  private http = inject(HttpClient);
  private snackbarService = inject(SnackbarService)
  private localStorageService = inject(LocalStorageService);
  private baseUrl = environment.apiUrl;

  login(loginModel: LoginModel) {
    return this.http.post<UserModel>(this.baseUrl + 'accounts/login', loginModel)
      .pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
          }
        }),
        catchError(error => {
          this.snackbarService.error("Logowanie nie powiodło się")
          return of(null)
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
