import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberModel } from '../../../../../models/member-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'da-member-profile',
  imports: [
    DatePipe
  ],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit {
  protected member = signal<MemberModel | undefined>(undefined)
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    //użycie resolvera - używamy parent bo resolver w routingu jest zainmplementowany na poziomie komponentu nadrzędenego
    this.route.parent?.data.subscribe(res =>
      //resolver w routingu jest zarejestrowany pod propertą member - resolve: {member: membersResolver},
      this.member.set(res['member'])
    );
  }
}
