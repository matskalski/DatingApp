import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  busuRequestCount = signal(0);

  busy(){
    this.busuRequestCount.update(curr => curr + 1);
  }

  idle(){
    this.busuRequestCount.update(curr => Math.max(0, curr - 1));
  }
}
