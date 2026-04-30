import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageModel } from './../../../../../models/message-model';
import { MembersService } from './../../../../../services/members/members-service';
import { MessagesService } from './../../../../../services/messages/messages-service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MessageBubble } from '../../../../messages/message-bubble/message-bubble';

@Component({
  selector: 'da-member-messages',
  imports: [
    MessageBubble
  ],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit {
  protected messages = signal<MessageModel[]>([]);

  private messagesService = inject(MessagesService);
  private MembersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    this.loadMessages();
  };

  loadMessages() {
    const memberId = this.MembersService.member()?.id;

    if (memberId) {
      this.messagesService.getMessageThread(memberId)
        .pipe(
          takeUntilDestroyed(this.destroyRef))
        .subscribe(messages => this.messages.set(messages));
    }
  };
}
