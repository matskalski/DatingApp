import { Component } from '@angular/core';
import { MembersList } from './members-list/members-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MembersTails } from './members-tails/members-tails';

@Component({
  selector: 'da-members',
  imports: [
    MembersList,
    MembersTails,
    MatButtonToggleModule,
    MatIcon
  ],
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class Members {
  protected option: 'list' | 'tails' = 'list'

  changeOption(value: 'list' | 'tails'){
    this.option = value;
  }
}
