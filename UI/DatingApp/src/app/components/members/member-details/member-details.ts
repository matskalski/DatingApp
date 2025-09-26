import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MemberModel } from '../../../models/member-model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'da-member-details',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails {
  readonly dialogRef = inject(MatDialogRef<MemberDetails>);
  readonly data = inject<MemberModel>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
