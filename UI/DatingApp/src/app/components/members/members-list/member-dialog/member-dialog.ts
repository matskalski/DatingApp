import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MemberModel } from '../../../../models/member-model';

@Component({
  selector: 'da-member-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './member-dialog.html',
  styleUrl: './member-dialog.css'
})
export class MemberDialog {
  readonly dialogRef = inject(MatDialogRef<MemberDialog>);
  readonly data = inject<MemberModel>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
