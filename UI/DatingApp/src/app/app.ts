import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MembersService } from './services/members/members-service';
import { MemberModel } from './models/member-model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Nav } from './components/nav/nav';
import { LocalStorageService } from './services/localStorage/local-storage-service';
import { AccountsService } from './services/accounts/accounts-service';

@Component({
  selector: 'da-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatTableModule,
    Nav
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  membersService: MembersService = inject(MembersService);
  members = signal<MemberModel[]>([]);
  destroyRef = inject(DestroyRef);

  private localStorageService = inject(LocalStorageService);
  private accountService = inject(AccountsService);

  columnsToDisplay = ['id', 'displayName', 'email'];

  ngOnInit(): void {
    this.setCurrentUser()
  }

  setCurrentUser() {
    const userStr = this.localStorageService.getItem('user');
    if (!userStr) {
      return;
    }

    const user = JSON.parse(userStr);
    this.accountService.currentUser.set(user)
  }

}
