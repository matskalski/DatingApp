import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'da-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:7144/api/'

  get404Error(){
    this.http.get(this.baseUrl + 'buggy/not-found')
    .subscribe(res => console.log(res));
  }

  get400Error(){
    this.http.get(this.baseUrl + 'buggy/bad-request')
    .subscribe(res => console.log(res));
  }

  get500Error(){
    this.http.get(this.baseUrl + 'buggy/server-error')
    .subscribe(res => console.log(res));
  }

  get401Error(){
    this.http.get(this.baseUrl + 'buggy/auth')
    .subscribe(res => console.log(res));
  }

  getValidationError(){
    this.http.post(this.baseUrl + 'accounts/register', {})
    .subscribe(res => console.log(res));
  }
}
