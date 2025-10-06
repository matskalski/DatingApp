import { Observable } from 'rxjs';
import { MembersService } from './../../../services/members/members-service';
import { Component, inject } from '@angular/core';
import { MemberModel } from '../../../models/member-model';
import { AsyncPipe } from '@angular/common';
import { MemberTail } from './member-tail/member-tail';

@Component({
  selector: 'da-members-tails',
  imports: [
    AsyncPipe,
    MemberTail
  ],
  templateUrl: './members-tails.html',
  styleUrl: './members-tails.css'
})
export class MembersTails {
  protected members$: Observable<MemberModel[]>;
  private membersService = inject(MembersService);

  constructor(){
    this.members$ = this.membersService.getMembers();
  }
}
