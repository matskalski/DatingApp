import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../services/likes/likes-service';
import { MemberModel } from '../../models/member-model';
import { Predicate } from '../../enums/predicate.enum';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MemberTail } from '../members/members-tails/member-tail/member-tail';
import { first } from 'rxjs';

@Component({
  selector: 'da-lists',
  imports: [
    MatTabsModule,
    MemberTail
  ],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {

  protected members = signal<MemberModel[]>([]);
  protected predicate? = Predicate.liked;
  protected predicateEnum = Predicate;

  private likesService = inject(LikesService);

  ngOnInit(): void {
    this.loadLikes();
  }

  onSelectedTabChange($event: MatTabChangeEvent) {
    switch ($event.tab.textLabel) {
      case "liked":
        this.setPredicate(Predicate.liked);
        break;
      case "likedBy":
        this.setPredicate(Predicate.likedBy);
        break;
      default:
        this.setPredicate(undefined);
        break;
    }
  }

  protected setPredicate(predicate?: Predicate) {
    if (this.predicate !== predicate) {
      this.predicate = predicate;
      this.loadLikes();
    }
  }

  protected loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe(members => {
      this.members.set(members);
    });
    this.likesService.getLikeIds().pipe(first()).subscribe();
  }
}
