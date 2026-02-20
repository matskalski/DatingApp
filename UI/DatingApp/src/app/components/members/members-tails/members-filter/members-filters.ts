import { Component, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'da-members-filter',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
        MatDialogClose,
        FormsModule
  ],
  templateUrl: './members-filters.html',
  styleUrl: './members-filters.css'
})
export class MembersFilters {
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<MembersFilters>);
  readonly data = inject<{gender:string, minAge: number, maxAge: number}>(MAT_DIALOG_DATA);
  readonly result = model(this.data)

  // form: FormGroup = this.fb.group({
  //   gender: [this.data.gender],
  //   minAge: [this.data.minAge],
  //   maxAge: [this.data.maxAge]
  // });

  close(): void {
    this.dialogRef.close();

    // console.log('close', this.data, this.form)
  }
}
