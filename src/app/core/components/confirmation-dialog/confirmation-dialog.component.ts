import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Import services
import { ThemeService, ThemeType, ThemeChangedEventArgs } from '../../services/theme.service';

/**
 * Confirmation dialog component arguments. 
 *
 * @export
 * @class ConfirmationDialogArgs
 */
export class ConfirmationDialogArgs {
  constructor(public title: string, public message: string) {
  }
}

/**
 * Confirmation dialog component; present user with a Yes/No question and user has two options, "Yes" or "No".
 * 
 * Based on https://stackblitz.com/edit/reusable-confirmation-dialog-angular-material?file=src%2Fapp%2Fconfirm-dialog%2Fconfirm-dialog.component.ts
 *
 * @export
 * @class ConfirmationDialogComponent
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  title: string;
  message: string;

  isDarkThemeActive: boolean = false;

  /**
   * Creates an instance of ConfirmationDialogComponent.
   * 
   * @param {MatDialogRef<ConfirmationDialogComponent>} dialogRef Reference to dialog opened via MatDialog service (and in effect the confirmation service).
   * @param {ConfirmationDialogArgs} args Dialog arguments, i.e. title and message.
   * @memberof ConfirmationDialogComponent
   */
  constructor(private _themeService: ThemeService, public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public args: ConfirmationDialogArgs) {
    this.title = args.title;
    this.message = args.message;
    this.isDarkThemeActive = _themeService.getActiveTheme() === ThemeType.DarkTheme;
  }

  /**
   * Function to to handle the 'Yes' button click event. 
   *
   * @memberof ConfirmationDialogComponent
   */
  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  /**
   * Function to to handle the 'No' button click event.
   *
   * @memberof ConfirmationDialogComponent
   */
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
