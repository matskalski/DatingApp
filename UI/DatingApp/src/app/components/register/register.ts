import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts/accounts-service';
import { RegisterModel } from '../../models/register-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { passwordConfirmValidator } from '../../validators/password-confirm.validator';
import { ConfirmPasswordErrorStateMatcher } from './confirm-password-error-state-matcher';

@Component({
  selector: 'da-register',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  confirmPasswordErrorStateMatcher: ConfirmPasswordErrorStateMatcher = new ConfirmPasswordErrorStateMatcher();

  private fb = inject(FormBuilder);
  private accountsService = inject(AccountsService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form: FormGroup = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    displayName: ['', [
      Validators.required
    ]],
    password: ['', [
      Validators.required
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.minLength(4)
    ]]
  },{
    validators: [passwordConfirmValidator()]
  })

  register() {
    if (this.form.valid) {
      const registerModel: RegisterModel = {
        email: this.form.controls['email'].value,
        displayName: this.form.controls['displayName'].value,
        password: this.form.controls['password'].value,
        confirmPassword: this.form.controls['confirmPassword'].value
      }

      this.accountsService.register(registerModel)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => this.router.navigate(['/']))
        )
        .subscribe()
    }
  }
}
