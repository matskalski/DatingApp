import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MembersService } from './services/members-service';
import { Member } from './models/member';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatTableModule} from '@angular/material/table';
import { Nav } from './components/nav/nav';

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
  membersService : MembersService = inject(MembersService);  
  members = signal<Member[]>([]);
  destroyRef = inject(DestroyRef)

  columnsToDisplay = ['id', 'displayName', 'email'];

  ngOnInit(): void {
    this.membersService.getMembers()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(resp => this.members.set(resp))
  }

}
