import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MemberModel } from '../../models/member-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  httpClient: HttpClient = inject(HttpClient)

  getMembers() : Observable<MemberModel[]> {
    return this.httpClient.get<MemberModel[]>("https://localhost:7144/api/members")
  }
}
