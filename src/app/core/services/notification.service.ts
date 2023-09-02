import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent, SnackBarNotificationType, SnackBarNotificationArgs } from '../components/snackbar-notification/snackbar-notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // The minimum duration to display a notification for in miliseconds.
  private readonly MIN_DURATION: number = 1000;

  // The maximum duration to display a notification for in miliseconds.
  private readonly MAX_DURATION: number = 4000;

  /**
   * Creates an instance of NotificationService.
   * @param {MatSnackBar} _snackBar The snackbar component used to display notification messages.
   * @memberof NotificationService
    */
  constructor(private _snackBar: MatSnackBar) { }

  /**
   * General function to manage showing a snackbar to display a notification message to user.
   *
   * @param {string} message The message to dislay to the user.
   * @param {string} [snackType] The type of snackbar/notification to displaly. (Optional, default 'Information')
   * @param {number} [duration] The duration to display the notification for. (Optional, minimum 1 second, maximum 5 seconds, default 5 seconds.)
   * @memberof NotificationService
   */
  show(snackType: SnackBarNotificationType, message: string, duration?: number) {
    const config: MatSnackBarConfig = new MatSnackBarConfig();
    config.duration = ((duration !== undefined) || (duration! < this.MIN_DURATION) || (duration! > this.MAX_DURATION) ? duration : this.MAX_DURATION);
    config.horizontalPosition = 'start';
    config.verticalPosition = 'bottom';
    config.panelClass = this.getPanelClass(snackType),
    config.data = new SnackBarNotificationArgs(snackType, message, () => { this._snackBar.dismiss() })

    this._snackBar.openFromComponent(SnackbarNotificationComponent, config);
  }

  /**
   * Closes the snackbar.
   *
   * @memberof NotificationService
   */
  close() {
    this._snackBar.dismiss();
  }

  /**
   * Gets the CSS panel class to use for the supplied notification type.
   *
   * @private
   * @param {string} [snackType] The type of notification to get the CSS panel class for.
   * @return {*}  {string} The CSS panel class name.
   * @memberof NotificationService
   */
  private getPanelClass(snackType: SnackBarNotificationType): string {
    switch (snackType) {
      case SnackBarNotificationType.Success:
        return 'success-snackbar';
      case SnackBarNotificationType.Error:
        return 'error-snackbar';
      case SnackBarNotificationType.Warning:
        return 'warning-snackbar';
      case SnackBarNotificationType.Help:
        return 'help-snackbar';
      case SnackBarNotificationType.Information:
      default:
        return 'info-snackbar';
    }
  }

  /**
    * Display a success notification.
    *
    * @param {string} message The message to dislay to the user.
    * @memberof NotificationService
    */
  success(message: string) {
    this.show(SnackBarNotificationType.Success, message);
  }

  /**
   * Display a warning notification.
   *
   * @param {string} message The message to dislay to the user.
   * @memberof NotificationService
   */
  warn(message: string) {
    this.show(SnackBarNotificationType.Warning, message);
  }

  /**
   * Display an informational notification.
   *
   * @param {string} message The message to dislay to the user.
   * @memberof NotificationService
   */
  information(message: string) {
    this.show(SnackBarNotificationType.Information, message);
  }

  /**
   * Display an error notification.
   *
   * @param {string} message The message to dislay to the user.
   * @memberof NotificationService
   */
  error(message: string) {
    this.show(SnackBarNotificationType.Error, message);
  }

  /**
   * Display a help notification.
   *
   * @param {string} message The message to dislay to the user.
   * @memberof NotificationService
   */
  help(message: string) {
    this.show(SnackBarNotificationType.Help, message);
  }
}
