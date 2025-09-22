import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'da-not-found',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
