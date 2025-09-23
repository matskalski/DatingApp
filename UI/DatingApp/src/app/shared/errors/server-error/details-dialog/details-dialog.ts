import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
@Component({
  selector: 'da-details-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
  ],
  templateUrl: './details-dialog.html',
  styleUrl: './details-dialog.css'
})
export class DetailsDialog {
  readonly dialogRef = inject(MatDialogRef<DetailsDialog>);
  readonly data = inject<string>(MAT_DIALOG_DATA);

  close(){
    this.dialogRef.close();
  }
}
