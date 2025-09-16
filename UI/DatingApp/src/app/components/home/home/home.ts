import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'da-home',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected registerMode = signal(false)

  showRegister(){
    this.registerMode.set(true)
  }
}
