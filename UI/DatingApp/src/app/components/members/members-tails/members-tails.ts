import { LocalStorageService } from './../../../services/localStorage/local-storage-service';
import { filter } from 'rxjs';
import { MemberParams } from './../../../models/member-params';
import { PaginatedResult } from './../../../models/pagination-model';
import { MembersService } from './../../../services/members/members-service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberModel } from '../../../models/member-model';
import { MemberTail } from './member-tail/member-tail';
import { Paginator } from "../../../shared/paginator/paginator";
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MembersFilters } from './members-filter/members-filters';

@Component({
  selector: 'da-members-tails',
  imports: [
    MemberTail,
    Paginator,
    MatButton,
  ],
  templateUrl: './members-tails.html',
  styleUrl: './members-tails.css'
})
export class MembersTails implements OnInit {
  readonly dialog = inject(MatDialog);

  protected paginatedMembers = signal<PaginatedResult<MemberModel> | null>(null);
  protected memberParams = new MemberParams()
  private membersService = inject(MembersService);

  displayMessage: string = ''

  ngOnInit(): void {
    // setTimeout(() => this.loadMembers(), 300)
    this.loadMembers();
    this.setDisplayMessage()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MembersFilters, {
      data: {
        gender: this.memberParams.gender,
        minAge: this.memberParams.minAge,
        maxAge: this.memberParams.maxAge
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.minAge < 18) {
          // this.minAge.set(18);
          this.memberParams.minAge = 18;
        }
        else {
          // this.minAge.set(result.minAge);
          this.memberParams.minAge = result.minAge;
        }

        if (result.maxAge < result.minAge) {
          this.memberParams.maxAge = result.minAge
        }

        else {
          this.memberParams.maxAge = result.maxAge;
        }

        this.memberParams.gender = result.gender;
        this.loadMembers();
        this.setDisplayMessage();
      }
    });
  }

  loadMembers() {
    this.membersService.getMembers(this.memberParams)
      .subscribe(res => this.paginatedMembers.set(res));
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.loadMembers();
  }

  private setDisplayMessage() {
    //konieczne do uniknięcia błędu NG0100
    setTimeout(() => {
      const defaultParams = new MemberParams();

      const filters: string[] = [];

      if (this.memberParams.gender) {
        filters.push(this.memberParams.gender + 's');
      }
      else {
        filters.push("Males & Females");
      }

      if (this.memberParams.minAge !== defaultParams.minAge || this.memberParams.maxAge !== defaultParams.maxAge) {
        filters.push(` ages ${this.memberParams.minAge}-${this.memberParams.maxAge}`)
      }

      this.displayMessage = filter.length > 0 ? `selected: ${filters.join(' | ')}` : 'all members';
    }, 0);
  }
}
