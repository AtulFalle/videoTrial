import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageBoxService {
  constructor(public snackBar: MatSnackBar) {}

  openSuccessMessage(message: string): void {
    const config = {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'success',
    } as MatSnackBarConfig<any>;
    this.snackBar.open(message, 'OK', config);
  }

  openErrorMessage(message: string): void {
    const config = {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'error',
    } as MatSnackBarConfig<any>;
    this.snackBar.open(message, 'OK', config);
  }
}
