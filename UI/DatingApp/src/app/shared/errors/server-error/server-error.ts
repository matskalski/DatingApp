import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../models/api-error-model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  protected error: ApiError;
  protected showDetails = false;
  private router = inject(Router);

  constructor() {
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }

  detailsToggle(){
    this.showDetails = !this.showDetails
  }
}
