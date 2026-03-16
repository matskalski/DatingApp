import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MemberModel } from '../../models/member-model';
import { tap } from 'rxjs';
import { Predicate } from '../../enums/predicate.enum';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<string[]>([]);

  getLikes(predicate?: Predicate) {
    if (predicate === Predicate.liked || predicate === Predicate.likedBy) {
      return this.http.get<MemberModel[]>(this.baseUrl + 'likes?predicate=' + predicate);
    }
    else {
      return this.http.get<MemberModel[]>(this.baseUrl + 'likes');
    }
  }

  getLikeIds() {
    return this.http.get<string[]>(this.baseUrl + 'likes/list')
      .pipe(tap(ids => this.likeIds.set(ids)))
  }

  toogleLike(targetMemberId: string) {
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`, {});
  }

  clearLikeIds(){
    this.likeIds.set([]);
  }

}
