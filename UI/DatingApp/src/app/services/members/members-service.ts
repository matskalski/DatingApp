import { PhotoModel } from './../../models/photo-model';
import { UpdateMember } from './../../models/update-member.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MemberModel } from '../../models/member-model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<MemberModel | null>(null)

  getMembers() : Observable<MemberModel[]> {
    return this.httpClient.get<MemberModel[]>(`${this.baseUrl}members`);
  };

  getMember(id: string){
    return this.httpClient.get<MemberModel>(`${this.baseUrl}members/${id}`)
      .pipe(
        tap(mbr => this.member.set(mbr))
      )
    ;
  };

  getMemberPhotos(id: string) : Observable<PhotoModel[]> {
    return this.httpClient.get<PhotoModel[]>(`${this.baseUrl}members/${id}/photos`);
  }

  updateMember(updateMember: UpdateMember) : Observable<MemberModel> {
    return this.httpClient.put<MemberModel>(`${this.baseUrl}members`, updateMember)
  }

  uploadPhoto(file: File){
    const formData = new FormData();
    formData.append('file', file);
    console.log('aaa', formData)
    return this.httpClient.post<PhotoModel>(`${this.baseUrl}members/add-photo`, formData);
  }

  setMainPhoto(photoId: number){
    return this.httpClient.put(`${this.baseUrl}members/set-main-photo/${photoId}`,{})
  }

  deletePhoto(photoId: number){
    return this.httpClient.delete(`${this.baseUrl}members/delete-photo/${photoId}`)
  }
}
