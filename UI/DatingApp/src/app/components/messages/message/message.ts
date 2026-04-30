import { Component, input, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MessageModel } from '../../../models/message-model';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { AccountsService } from '../../../services/accounts/accounts-service';
import { MessageBubble } from '../message-bubble/message-bubble';

@Component({
  selector: 'da-message',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    DatePipe,
    MessageBubble
],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message {
  message = input<MessageModel | undefined>(undefined);
  memberProfileUrl = input<string | undefined>(undefined);

  private accountsService = inject(AccountsService);

  get isOutgoing() {
    const currentUser = this.accountsService.currentUser();
    return currentUser && this.message()?.senderId === currentUser.id;
  }
}
