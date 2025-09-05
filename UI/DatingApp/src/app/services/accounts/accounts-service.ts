import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Login } from '../../models/login';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7144/api/'
  currentUser = signal<User | null>(null)

  login(loginModel: Login){
    return this.http.post(this.baseUrl + 'accounts/login', loginModel)
  }
}
