import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'da-roles-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCheckboxModule
  ],
  templateUrl: './roles-dialog.html',
  styleUrl: './roles-dialog.css'
})
export class RolesDialog {
  readonly dialogRef = inject(MatDialogRef<RolesDialog>);
  readonly data = inject<RolesDialogData>(MAT_DIALOG_DATA);

  protected selectedRoles: { role: string, isChecked: boolean }[] =
    this.data.roles
      .map(role => {
        return {
          role: role.name, isChecked: role.userHasRole
        }
      })

  readonly result = model(this.selectedRoles)

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  onCheckChanged(role: string, value: boolean) {
    let newSelectedRoles = [...this.selectedRoles];

    const objectIndex = newSelectedRoles.findIndex(obj => obj.role === role);

    newSelectedRoles[objectIndex].isChecked = value;

    this.selectedRoles = newSelectedRoles;
  }
}

export interface RolesDialogData {
  user: string;
  roles: { name: string, userHasRole: boolean }[]
}
