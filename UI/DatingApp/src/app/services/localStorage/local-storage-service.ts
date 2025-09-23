import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getItem(key: string) : string | null {
    return localStorage.getItem(key)
  }

  getItemAsObject<T>(key: string): T | null{
    try{
      const objStr = this.getItem(key);

      if(objStr){
        const obj = JSON.parse(objStr) as T;
        return obj;
      }

      return null;
    }
    catch{
      return null;
    }
  }

  setItem(key: string, value: any) : void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}
