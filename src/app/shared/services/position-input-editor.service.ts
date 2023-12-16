import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { EditModelDialogComponent, EditorModeType, IEditorArgs, IEditModelResponse, IEditMultipleModelsResponse, SaveActionFlags as _SaveActionFlags } from '../../features/models/position-input-editor-dialog/position-input-editor-dialog.component';
import { PositionInput } from '../models/position-input';

// Some TypeScript vodoo magic to get the action flags re-exported for use in the HTML template.
export import SaveActionFlags = _SaveActionFlags;

/**
 * Service managing the display of the position input editor.
 *
 * @export
 * @class PositionInputEditorService
 */
@Injectable({
  providedIn: 'root'
})
export class PositionInputEditorService {
  private readonly _addedPosition = new Subject<IEditModelResponse>();
  private readonly _updatedPosition = new Subject<IEditModelResponse>();
  private readonly _updatedPositions = new Subject<IEditMultipleModelsResponse>();

  /**
   * Creates an instance of PositionInputEditorService.
   * 
   * @param {MatDialog} _dialog
   * @memberof PositionInputEditorService
   */
  constructor(private _dialog: MatDialog) { }

  /**
   * Observable of the newly added position.
   *
   * @readonly
   * @type {Observable<IEditModelResponse>}
   * @memberof PositionInputEditorService
   */
  public get AddedPosition(): Observable<IEditModelResponse> {
    return this._addedPosition.asObservable();
  }

  /**
   * Observable of the updated position.
   *
   * @readonly
   * @type {Observable<IEditModelResponse>}
   * @memberof PositionInputEditorService
   */
  public get UpdatedPosition(): Observable<IEditModelResponse> {
    return this._updatedPosition.asObservable();
  }

  /**
   * Observable of the updated positions.
   *
   * @readonly
   * @type {Observable<IEditMultipleModelsResponse>}
   * @memberof PositionInputEditorService
   */
  public get UpdatedPositions(): Observable<IEditMultipleModelsResponse> {
    return this._updatedPositions.asObservable();
  }

  /**
   * Creates a MatDialg reference instance to be used to manage display of the position input editor UI component.
   *
   * @private
   * @param {IEditorArgs} args The editor args used to init the position input editor.
   * @return {*}  {*} A reference to an open dialog.
   * @memberof PositionInputEditorService
   */
  private createDialogRef(args: IEditorArgs): any {
    return this._dialog.open(EditModelDialogComponent, {
      width: "auto",
      height: "auto",
      data: args
    });
  }

  /**
   * Opens a position input editor to duplication the supplied position.
   *
   * @param {PositionInput} positionInput The position's input values to duplication.
   * @param {SaveActionFlags} saveActionFlags
   * @memberof PositionInputEditorService
   */
  openDuplicateModelDialog(positionInput: PositionInput, saveActionFlags: SaveActionFlags) {
    const dialogRef = this.createDialogRef({ editorMode: EditorModeType.DuplicateOne, modelInput: positionInput, saveActionFlags: saveActionFlags });

    dialogRef.afterClosed()
      .subscribe((response: IEditModelResponse) => {
        // Duplicating is in effect adding a NEW model, so just add to _addedPosition
        this._addedPosition.next(response);
      });
  }

  /**
   * Opens a position input editor to add new position input values.
   *
   * @param {SaveActionFlags} saveActionFlags The type of available save actions to display on the dialog.
   * @memberof PositionInputEditorService
   */
  openAddModelDialog(saveActionFlags: SaveActionFlags) {
    const dialogRef = this.createDialogRef({ editorMode: EditorModeType.AddOne, modelInput: undefined, saveActionFlags: saveActionFlags });

    dialogRef.afterClosed()
      .subscribe((response: IEditModelResponse) => {
        this._addedPosition.next(response);
      });
  }

  /**
   * Opens a position input editor to edit the supplied position input values.
   *
   * @param {PositionInput} positionInput The position's input values to edit.
   * @param {SaveActionFlags} saveActionFlags The type of available save actions to display on the dialog.
   * @memberof PositionInputEditorService
   */
  openEditPositionDialog(positionInput: PositionInput, saveActionFlags: SaveActionFlags) {
    const dialogRef = this.createDialogRef({ editorMode: EditorModeType.EditOne, modelInput: positionInput, saveActionFlags: saveActionFlags });

    dialogRef.afterClosed()
      .subscribe((response: IEditModelResponse) => {
        this._updatedPosition.next(response);
      });
  }

  /**
   * Opens a position input editor to edit the supplied position input values for multiple positions as determined by the supplied IDs.
   *
   * @param {string[]} ids The IDs of the position documents to update with field level updates.
   * @memberof PositionInputEditorService
   */
  openEditMultipleModelsDialog(ids: string[]) {
    const dialogRef = this.createDialogRef({ editorMode: EditorModeType.EditMultiple, ids: ids, saveActionFlags: SaveActionFlags.SaveAndClose });

    dialogRef.afterClosed()
      .subscribe((response: IEditMultipleModelsResponse) => {
        this._updatedPositions.next(response);
      });
  }
}
