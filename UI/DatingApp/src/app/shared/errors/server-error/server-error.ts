import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../models/api-error-model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialog } from './details-dialog/details-dialog';

@Component({
  selector: 'da-server-error',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {
  readonly dialog = inject(MatDialog);
  protected error: ApiError;
  private router = inject(Router);

  constructor() {
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }

  openDetailsDialog() {
    const dialogRef = this.dialog.open(DetailsDialog, {
      data: this.error.details,
    });
  }
}
