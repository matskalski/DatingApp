import { LoadingService } from './../../services/loading/loading-service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../../services/accounts/accounts-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { LoginModel } from '../../models/login-model';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatMenuModule,
    RouterLink,
    RouterLinkActive,
    MatProgressSpinnerModule
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private fb = inject(FormBuilder);
  protected accountService = inject(AccountsService);
  protected LoadingService = inject(LoadingService);
  private router = inject(Router);
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
      const loginModel: LoginModel = {
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value
      }

      this.accountService.login(loginModel)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => this.router.navigateByUrl('/members'))
        )
        .subscribe();
    }
  }

  logout() {
    this.accountService.logout()
    this.router.navigateByUrl('/home')
  }

  editProfile() {
    this.router.navigateByUrl(`members/${this.accountService.currentUser()?.id}`)
  }
}
