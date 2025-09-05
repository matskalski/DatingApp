import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member } from '../../models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  httpClient: HttpClient = inject(HttpClient)

  getMembers() : Observable<Member[]> {
    return this.httpClient.get<Member[]>("https://localhost:7144/api/members")
  }
}
