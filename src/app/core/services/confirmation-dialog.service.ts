import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmationDialogComponent, ConfirmationDialogArgs } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private _dialogRef: MatDialogRef<ConfirmationDialogComponent> | undefined;

  /**
   * Creates an instance of ConfirmationDialogService.
   * 
   * @param {MatDialog} _dialog
   * @memberof ConfirmationDialogService
   */
  constructor(private _dialog: MatDialog) { }

  /**
   * Shows confirmation dialog with the supplid arguments.
   *
   * @param {ConfirmationDialogArgs} args The arguments used to display the confirmation dialog (i.e. title and message).
   * @return {*}  {Observable<boolean>} An observable that is notified when the dialog is finished closing.
   * @memberof ConfirmationDialogService
   */
  public showDialog(args: ConfirmationDialogArgs): Observable<boolean> {
    this._dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: args,
      enterAnimationDuration: 100
    })

    return this._dialogRef.afterClosed() as Observable<boolean>;
  }
}
