import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MembersService } from './services/members-service';

@Component({
  selector: 'da-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  membersService : MembersService = inject(MembersService);

  ngOnInit(): void {
    this.membersService.getMembers()
      .subscribe()
  }

}
