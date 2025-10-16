import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MembersService } from './../../../../services/members/members-service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { filter } from 'rxjs';
import { MemberModel } from '../../../../models/member-model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgePipe } from '../../../../pipes/age-pipe';

@Component({
  selector: 'da-member-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    AgePipe
  ],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails implements OnInit {
  protected member = signal<MemberModel | undefined>(undefined)
  protected title = signal<string | undefined>('Profile')

  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    //użycie resolvera
    this.route.data.subscribe(res =>
      //resolver w routingu jest zarejestrowany pod propertą member - resolve: {member: membersResolver},
      this.member.set(res['member'])
    );

    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(ev => ev instanceof NavigationEnd)
      )
      .subscribe(() =>
        this.title.set(this.route.firstChild?.snapshot?.title)
      )
  };
}
