import { Component, inject } from '@angular/core';
import { AccountsService } from '../services/accounts/accounts-service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { UserManagement } from './user-management/user-management';
import { PhotoManagement } from './photo-management/photo-management';

@Component({
  selector: 'da-admin',
  imports: [
    MatTabsModule,
    UserManagement,
    PhotoManagement
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  protected accountService = inject(AccountsService);

  onSelectedTabChange($event: MatTabChangeEvent) {
    switch ($event.tab.textLabel) {

    }
  }
}
