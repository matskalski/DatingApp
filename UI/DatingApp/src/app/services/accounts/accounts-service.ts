import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { LoginModel } from '../../models/login-model';
import { UserModel } from '../../models/user-model';
import { catchError, first, tap } from 'rxjs/operators';
import { LocalStorageService } from '../localStorage/local-storage-service';
import { RegisterModel } from '../../models/register-model';
import { EMPTY, of } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar-service';
import { environment } from '../../../environments/environment';
import { LikesService } from '../likes/likes-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  currentUser = signal<UserModel | null>(null)

  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  private snackbarService = inject(SnackbarService)
  private localStorageService = inject(LocalStorageService);
  private baseUrl = environment.apiUrl;

  login(loginModel: LoginModel) {
    return this.http.post<UserModel>(this.baseUrl + 'accounts/login', loginModel, { withCredentials: true })
      .pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        }),
        catchError(error => {
          this.snackbarService.error("Logowanie nie powiodło się")
          return of(null)
        })
      )
  }

  logout() {
    // this.localStorageService.removeItem('user')
    this.currentUser.set(null);
    this.likesService.clearLikeIds();
  }

  register(registerModel: RegisterModel) {
    return this.http.post<UserModel>(this.baseUrl + 'accounts/register', registerModel, { withCredentials: true })
      .pipe(
        tap(user => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      )
  }

  refreshToken() {
    return this.http.post<UserModel>(this.baseUrl + 'accounts/refresh-token', {}, { withCredentials: true })
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<UserModel>(this.baseUrl + 'accounts/refresh-token', {}, { withCredentials: true })
        .pipe(
          catchError(err => {
            this.logout();
            return EMPTY; // przerywa strumień bez propagowania błędu dalej
          })
        )
        .subscribe(user => this.setCurrentUser(user));
    }, 5 * 60 * 1000)
  }

  setCurrentUser(user: UserModel) {
    user.roles = this.getRolesFromToken(user);
    // this.localStorageService.setItem('user', user);
    this.currentUser.set(user);
    this.likesService.getLikeIds().pipe(first()).subscribe();
  }

  private getRolesFromToken(user: UserModel): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }
}
