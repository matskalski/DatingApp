import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin-service/admin-service';
import { UserModel } from '../../models/user-model';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { RolesDialog } from './roles-dialog/roles-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'da-user-management',
  imports: [
    MatTableModule,
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  protected users = signal<UserModel[]>([]);
  protected displayedColumns = ['email', 'roles', 'actions'];
  protected avaliableRoles = ['Member', 'Moderator', 'Admin'];

  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  openDialog(user: string): void {
    const userRoles = this.users().find(u => u.id == user)?.roles

    const dialogRef = this.dialog.open(RolesDialog, {
      data: {
        user: user,
        roles: this.avaliableRoles.map(role => {
          return {
            name: role,
            userHasRole: userRoles?.includes(role)
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const res = result as Array<{ role: string, isChecked: boolean }>;
        let roles = res
          .filter(item => item.isChecked)
          .map(item => item.role);

        this.adminService.updateUserRoles(user, roles)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.getUsersWithRoles());
      }
    });
  }

  private getUsersWithRoles() {
    this.adminService.getUserWithRoles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => this.users.set(users));
  }

}
