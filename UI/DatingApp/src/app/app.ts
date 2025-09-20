import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Nav } from './shared/nav/nav';

@Component({
  selector: 'da-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatTableModule,
    Nav
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 

}
