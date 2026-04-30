import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../../models/pagination-model';
import { MessageModel } from '../../models/message-model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMessages(container: string, pageNumber: number, pageSize: number){
    let params = new HttpParams();

    params = params.append('container', container);
    params = params.append('pageSize', pageSize);
    params = params.append('pageNumber', pageNumber);

    return this.http.get<PaginatedResult<MessageModel>>(this.baseUrl + 'messages', {params})
  };

  getMessageThread(memberId: string){
    return this.http.get<MessageModel[]>(this.baseUrl + 'messages/thread/' + memberId);
  }
}
