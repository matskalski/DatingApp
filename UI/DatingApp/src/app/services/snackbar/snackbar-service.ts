import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Snackbar } from '../../shared/snackbar/snackbar';
import { LoginModel } from '../../models/login-model';
import { SnackbarData } from '../../models/snackbar-data-model';
import { SnackbarIcons } from '../../enums/snackbar-icons-enum';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);

  info(message: string, duration: number = 5) {
    let snackbarData: SnackbarData = {
      message: message,
      icon: SnackbarIcons.info,
      duration: duration * 1000
    }
    this.openSnackBar(snackbarData, 'info-snackbar')
  }

  success(message: string, duration: number = 5) {
    let snackbarData: SnackbarData = {
      message: message,
      icon: SnackbarIcons.success,
      duration: duration * 1000
    }
    this.openSnackBar(snackbarData, 'success-snackbar')
  }

  warning(message: string, duration: number = 5) {
    let snackbarData: SnackbarData = {
      message: message,
      icon: SnackbarIcons.warning,
      duration: duration * 1000
    }
    this.openSnackBar(snackbarData, 'warning-snackbar')
  }

  error(message: string, duration: number = 5) {
    let snackbarData: SnackbarData = {
      message: message,
      icon: SnackbarIcons.error,
      duration: duration * 1000
    }
    this.openSnackBar(snackbarData, 'error-snackbar')
  }

  private openSnackBar(data: SnackbarData, panelClass: string) {
    this._snackBar.openFromComponent(Snackbar, {
      panelClass: panelClass,
      data: data
    });
  }
}
