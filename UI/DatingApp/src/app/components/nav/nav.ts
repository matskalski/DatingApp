import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'da-nav',
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected creds: any = {}

  private fb = inject(FormBuilder);
 //constructor(private fb: FormBuilder) { }

  form: FormGroup = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required
    ]]
  })

  login(){
    console.log('');
  }
}
