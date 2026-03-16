import { Component, computed, inject, input, output } from '@angular/core';
import { MemberModel } from '../../../../models/member-model';
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../../pipes/age-pipe';
import { LikesService } from '../../../../services/likes/likes-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'da-member-tail',
  imports: [
    MatCard,
    RouterLink,
    AgePipe,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './member-tail.html',
  styleUrl: './member-tail.css'
})
export class MemberTail {
  member = input.required<MemberModel>();
  private likesService = inject(LikesService);
  protected hasLiked = computed(() => this.likesService.likeIds().includes(this.member().id));

  toogleLike($event: MouseEvent) {
    {
      $event.stopPropagation();
      this.likesService.toogleLike(this.member().id)
        .subscribe(() => {
          if (this.hasLiked()) {
            this.likesService.likeIds.update(ids => ids.filter(id => id !== this.member().id));
          }
          else {
            this.likesService.likeIds.update(ids => [...ids, this.member().id]);
          }
        });
    }
  }
}
