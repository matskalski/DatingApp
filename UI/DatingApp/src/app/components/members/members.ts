import { Component } from '@angular/core';
import { MembersList } from './members-list/members-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'da-members',
  imports: [
    MembersList,
    MatButtonToggleModule,
    MatIcon
  ],
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class Members {

}
