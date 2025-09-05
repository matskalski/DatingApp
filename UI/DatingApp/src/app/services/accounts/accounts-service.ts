import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Login } from '../../models/login';
import { User } from '../../models/user';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../localStorage/local-storage-service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  currentUser = signal<User | null>(null)

  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private baseUrl = 'https://localhost:7144/api/';

  login(loginModel: Login){
    return this.http.post<User>(this.baseUrl + 'accounts/login', loginModel)
      .pipe(
        tap(user => {
          if(user){
            this.localStorageService.setItem('user', user);            
            this.currentUser.set(user)
          }
        })
      )
  }

  logout(){
    this.localStorageService.removeItem('user')
    this.currentUser.set(null)
  }
}
