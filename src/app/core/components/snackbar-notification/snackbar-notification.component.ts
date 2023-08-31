import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

/**
 * Available snackbar notification types
 *
 * @export
 * @enum {number}
 */
export enum SnackBarNotificationType {
  Success,
  Error,
  Warning,
  Information,
  Help
}

/**
 * Snackbar notification component arguments.
 *
 * @export
 * @class SnackBarNotificationArgs
 */
export class SnackBarNotificationArgs {
  constructor(public snackType: SnackBarNotificationType, public message: string, public closeSnackbar: () => void) {
  }
}

@Component({
  selector: 'app-snackbar-notification',
  templateUrl: './snackbar-notification.component.html',
  styleUrls: ['./snackbar-notification.component.scss']
})
export class SnackbarNotificationComponent {
  /**
   * Creates an instance of SnackbarNotificationComponent.
   * 
   * @param {*} data
   * @memberof SnackbarNotificationComponent
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarNotificationArgs) { }

  /**
   * Gets the Material icon name associated with the type of snackbar/notification being displayed. Called from the HTML template.
   *
   * @readonly
   * @memberof SnackbarNotificationComponent
   */
  get getIcon() {
    switch (this.data.snackType) {
      case SnackBarNotificationType.Success:
        return 'check_circle';
      case SnackBarNotificationType.Error:
        return 'error';
      case SnackBarNotificationType.Warning:
        return 'warning';
      case SnackBarNotificationType.Help:
        return 'contact_support';
      case SnackBarNotificationType.Information:
      default:
        return 'info';
    }
  }

  /**
   * Closes the snackbar/notification.
   *
   * @memberof SnackbarNotificationComponent
   */
  closeSnackbar() {
    this.data.closeSnackbar();
  }
}
