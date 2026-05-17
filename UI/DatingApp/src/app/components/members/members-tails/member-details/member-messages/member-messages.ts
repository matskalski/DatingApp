import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageModel } from './../../../../../models/message-model';
import { MembersService } from './../../../../../services/members/members-service';
import { MessagesService } from './../../../../../services/messages/messages-service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MessageBubble } from "../../../../../shared/message-bubble/message-bubble";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'da-member-messages',
  imports: [
    MessageBubble,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit {
  protected messages = signal<MessageModel[]>([]);

  private messagesService = inject(MessagesService);
  private MembersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    newMessageContent: ''
  });

  ngOnInit(): void {
    this.loadMessages();
  };

  loadMessages() {
    const memberId = this.MembersService.member()?.id;

    if (memberId) {
      this.messagesService.getMessageThread(memberId)
        .pipe(
          takeUntilDestroyed(this.destroyRef))
        .subscribe(messages => this.messages.set(messages.map(message => ({
          ...message,
          currentUserSender: message.senderId !== memberId
        }))));
    }
  };

  sendMessage() {
    const recipientId = this.MembersService.member()?.id;

    if (!recipientId) {
      return;
    };

    this.messagesService.sendMessage(recipientId, this.form.controls['newMessageContent'].value)
      .subscribe(message => {
        this.messages.update(messages => {
          message.currentUserSender = true;
          return [...messages, message]
        });
        
        this.form.controls['newMessageContent'].setValue('');
      });

  }
}
