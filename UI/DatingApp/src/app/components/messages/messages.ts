import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageModel } from '../../models/message-model';
import { PaginatedResult } from '../../models/pagination-model';
import { MessagesService } from './../../services/messages/messages-service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'da-messages',
  imports: [
    MatTabsModule,
    MatTableModule,
    DatePipe
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  protected container = "Inbox";
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<MessageModel> | null>(null);
  protected displayedColumns = ['sender', 'content', 'messageSent'];

  private messagesService = inject(MessagesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadMessages();
  }

  get isInbox() {
    return this.container === "Inbox";
  }

  protected setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessages();
  };

  protected onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize,
      this.pageNumber = event.pageNumber,
      this.loadMessages();
  };

  protected goToMessages(message: MessageModel) {
    this.router.navigateByUrl(`members/${this.isInbox? message.senderId : message.recipientId}/messages`);
  };

  private loadMessages() {
    this.messagesService.getMessages(this.container, this.pageNumber, this.pageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.paginatedMessages.set(res)
      });
  }
}
