import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../../services/accounts/accounts-service';
import { Login } from '../../models/login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'da-nav',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatMenuModule
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  protected loggedIn = signal(false);

  private fb = inject(FormBuilder);
  private accountService = inject(AccountsService);
  private destroyRef = inject(DestroyRef);

  form: FormGroup = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required
    ]]
  })

  login() {
    if (this.form.valid) {
      const loginModel: Login = {
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value
      }

      this.accountService.login(loginModel)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(resp => {
          this.loggedIn.set(true);
        });
    }
  }

  logout() {
    this.loggedIn.set(false);
  }
}
