import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageModel } from '../../models/message-model';
import { PaginatedResult } from '../../models/pagination-model';
import { MessagesService } from './../../services/messages/messages-service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Message } from './message/message';

@Component({
  selector: 'da-messages',
  imports: [
    MatTabsModule,
    Message
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  protected container = "Inbox";
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<MessageModel> | null>(null);

  private messagesService = inject(MessagesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadMessages();
  }

  get isInbox() {
    return this.container === "Inbox";
  }

  setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1,
      this.loadMessages();
  };

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize,
      this.pageNumber = event.pageNumber,
      this.loadMessages();
  }

  private loadMessages() {
    this.messagesService.getMessages(this.container, this.pageNumber, this.pageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        console.log(res)
        this.paginatedMessages.set(res)
      });
  }
}
