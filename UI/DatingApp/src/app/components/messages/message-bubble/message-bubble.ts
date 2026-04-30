import { Component, input } from '@angular/core';

@Component({
  selector: 'da-message-bubble',
  imports: [],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css'
})
export class MessageBubble {
  message = input<string>('');
  type = input<'incoming'|'outgoing'>('outgoing');
}