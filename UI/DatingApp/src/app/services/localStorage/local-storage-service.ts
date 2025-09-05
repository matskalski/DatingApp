import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getItem(key: string) : string | null {
    return localStorage.getItem(key)
  }

  setItem(key: string, value: any) : void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  removeItem(key: string): void {
    console.log('rem', key)
    localStorage.removeItem(key)
  }
}
