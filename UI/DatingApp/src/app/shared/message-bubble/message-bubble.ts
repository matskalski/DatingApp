import { Component, input } from '@angular/core';
import { MessageModel } from '../../models/message-model';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from "../../pipes/time-ago/time-ago-pipe";

export type MessageBubbleType = 'send' | 'answer';

@Component({
  selector: 'da-message-bubble',
  imports: [TimeAgoPipe],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css'
})
export class MessageBubble {
  message = input<MessageModel>();
  type = input<MessageBubbleType>('send');
}
