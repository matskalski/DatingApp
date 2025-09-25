import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MemberModel } from '../../models/member-model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccountsService } from '../accounts/accounts-service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private httpClient: HttpClient = inject(HttpClient);
  private accountService: AccountsService = inject(AccountsService);
  private baseUrl = environment.apiUrl;

  getMembers() : Observable<MemberModel[]> {
    return this.httpClient.get<MemberModel[]>(`${this.baseUrl}members`, this.getHttpOptions());
  }

  getMember(id: string){
    return this.httpClient.get<MemberModel>(`${this.baseUrl}members/${id}`, this.getHttpOptions());
  }

  private getHttpOptions(){
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      })
    }
  }
}
