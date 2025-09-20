import { Component, Inject, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarData } from '../../models/snackbar-data-model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'da-snackbar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css'
})
export class Snackbar implements OnInit, OnDestroy {
  private snackBarRef = inject(MatSnackBarRef<Snackbar>)

  value: WritableSignal<number> = signal<number>(100)
  private interval: number | undefined = undefined;

  //zalecane nie więcej niż 100, aby animacja progress bara była płynna
  //i nie mniej niż 50, ponieważ animacja nastapuje z opóźnieniem - 
  //przy mniejszych wartościach snackbar zamyka się zanim progressbar zmaleje do końca
  private updateIntervalMs: number = 75;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) { }

  ngOnInit() {
    this.update()
  }

  close() {
    this.snackBarRef.dismiss()
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  update() {
    let refreshCycles: number = 0;

    this.interval = setInterval(() => {
      if (this.value() <= 0) {
        this.close()
      }

      this.value.set((this.data.duration - (refreshCycles * this.updateIntervalMs)) * 100 / this.data.duration)
      refreshCycles++;

    }, this.updateIntervalMs);
  }

  ngOnDestroy(): void {
    this.close()
  }

}
