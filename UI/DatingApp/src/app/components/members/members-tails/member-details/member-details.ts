import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MembersService } from './../../../../services/members/members-service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { MemberModel } from '../../../../models/member-model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'da-member-details',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails implements OnInit {
  protected member$?: Observable<MemberModel>;
  protected title = signal<string | undefined>('Profile')

  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.member$ = this.loadMember();
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(ev => ev instanceof NavigationEnd)
      )
      .subscribe(() =>
        this.title.set(this.route.firstChild?.snapshot?.title)
      )
  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    return this.membersService.getMember(id);
  }
}
