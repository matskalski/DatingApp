import { Component, input } from '@angular/core';
import { MemberModel } from '../../../../models/member-model';
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'da-member-tail',
  imports: [
    MatCard,
    RouterLink
],
  templateUrl: './member-tail.html',
  styleUrl: './member-tail.css'
})
export class MemberTail {
  member = input.required<MemberModel>()
}
