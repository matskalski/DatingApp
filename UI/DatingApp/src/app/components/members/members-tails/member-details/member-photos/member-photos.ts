import { Component, inject } from '@angular/core';
import { MembersService } from '../../../../../services/members/members-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PhotoModel } from '../../../../../models/photo-model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'da-member-photos',
  imports: [
    AsyncPipe
  ],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos {
  protected photos$?: Observable<PhotoModel[]>

  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');

    if(memberId){
      this.photos$ = this.membersService.getMemberPhotos(memberId);
    }
  }

  get photoMocks(){
    return Array.from({length: 20}, (_, i) => ({
      url: 'user.png'
    }));
  }
}
