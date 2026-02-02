import { PaginatedResult } from './../../../models/pagination-model';
import { Observable } from 'rxjs';
import { MembersService } from './../../../services/members/members-service';
import { Component, inject } from '@angular/core';
import { MemberModel } from '../../../models/member-model';
import { AsyncPipe } from '@angular/common';
import { MemberTail } from './member-tail/member-tail';
import { Paginator } from "../../../shared/paginator/paginator";
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'da-members-tails',
  imports: [
    AsyncPipe,
    MemberTail,
    Paginator
],
  templateUrl: './members-tails.html',
  styleUrl: './members-tails.css'
})
export class MembersTails {
  protected paginatedMembers$: Observable<PaginatedResult<MemberModel>>;
  private membersService = inject(MembersService);
  pageNumber = 1;
  pageSize = 5

  constructor(){
    this.paginatedMembers$ = this.membersService.getMembers(this.pageNumber, this.pageSize);
  }

  loadMembers(){

  }

  onPageChange(event: {pageNumber: number, pageSize: number}){
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.paginatedMembers$ = this.membersService.getMembers(this.pageNumber, this.pageSize);
  }
}
