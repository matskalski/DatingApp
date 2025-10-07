import { ActivatedRoute } from '@angular/router';
import { MembersService } from './../../../../services/members/members-service';
import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MemberModel } from '../../../../models/member-model';

@Component({
  selector: 'da-member-details',
  imports: [
    AsyncPipe
  ],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails implements OnInit {
  protected member$?: Observable<MemberModel>;

  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);

   ngOnInit(): void {
    this.member$ = this.loadMember();
  }

  loadMember(){
    const id = this.route.snapshot.paramMap.get('id');
    if(!id){
      return;
    }

    return this.membersService.getMember(id);

  }
}
