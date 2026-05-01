import { Component, input } from '@angular/core';

export type MessageBubbleType = 'send' | 'answer';

@Component({
  selector: 'da-message-test',
  imports: [],
  templateUrl: './message-test.html',
  styleUrl: './message-test.css'
})
export class MessageTest {
  message = input<string>('');
  type = input<MessageBubbleType>('send');
}
