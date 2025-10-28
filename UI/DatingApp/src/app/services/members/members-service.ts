import { UpdateMember } from './../../models/update-member.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MemberModel } from '../../models/member-model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PhotoModel } from '../../models/photo-model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);

  getMembers() : Observable<MemberModel[]> {
    return this.httpClient.get<MemberModel[]>(`${this.baseUrl}members`);
  };

  getMember(id: string){
    return this.httpClient.get<MemberModel>(`${this.baseUrl}members/${id}`);
  };

  getMemberPhotos(id: string) : Observable<PhotoModel[]> {
    return this.httpClient.get<PhotoModel[]>(`${this.baseUrl}members/${id}/photos`);
  }

  updateMember(updateMember: UpdateMember) : Observable<MemberModel> {
    return this.httpClient.put<MemberModel>(`${this.baseUrl}members`, updateMember)
  }
}
