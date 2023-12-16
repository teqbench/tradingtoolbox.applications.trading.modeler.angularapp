import { Component, Inject, ViewChild } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { PositionRedererService } from '../../../../shared/services/position-renderer.service';

import { PositionInput } from '../../../../shared/models/position-input';
import { PositionScenario } from '../../../../shared/models/position-scenario';
import { PositionScenarioFees } from '../../../../shared/models/position-scenario-fees';
import { ScenarioFeesDialogComponent } from '../scenario-fees-dialog/scenario-fees-dialog.component';
import { PositionScenarioLot } from 'src/app/shared/models/position-scenario-lot';
import { ScenarioLotsDialogComponent } from '../scenario-lots-dialog/scenario-lots-dialog.component';
import { PositionInputEditorService, SaveActionFlags } from 'src/app/shared/services/position-input-editor.service';

/**
 * Render dialog args to init dialog with when first displayed.
 *
 * @export
 * @interface IRenderDialogArgs
 */
export interface IRenderDialogArgs {
  current: PositionInput,
  navList: PositionInput[]
}

/**
 * Component to manage the display of a rendered position.
 *
 * @export
 * @class ModelRenderDialogComponent
 */
@Component({
  selector: 'app-position-renderer-dialog',
  templateUrl: './position-renderer-dialog.component.html',
  styleUrls: ['./position-renderer-dialog.component.scss']
})
export class ModelRenderDialogComponent {
  // Reference to the position's input value table.
  @ViewChild("positionInputTable") _positionInputTable: MatTable<any> | undefined;

  // Reference to the scenario table.
  @ViewChild("scenarioTable") _scenarioTable: MatTable<any> | undefined;

  modelsTableDisplayColumns: string[] = [
    'pricePerShare',
    'averageNumberOfPositionsPerDay',
    'averageNumberOfLotsPerPosition',
    'estimatedSuccessRate',
    'totalNumberOfAsks',
    'adjustedNumbersOfAsks',
    'averageNumberOfTradingDaysPerWeek',
    'targetGain',
    'averageGainPerLot',
    'expenses',
    'effectiveTaxRate',
    'estimatedFeePerTransaction',
    'actions'
  ];

  scenariosTableDisplayColumns: string[] = [
    'month',
    'value',
    'size',
    'averageLotSize',
    'grossSinglePosition',
    'adjustedGrossSinglePosition',
    'netSinglePosition',
    'netAllPositions',
    'gainsWeekly',
    'gainsMonthly',
    'gainsYearly',
    'actions'
  ];

  // List of positions to display; this will only be list of one since only displaying a single positon, but 
  // makes it easier to use with a MatTable.
  positions: PositionInput[] = [];

  // The rendered scenarios for the current position.
  scenarios: PositionScenario[] = [];

  // Flag indicating if the current position is the first position in the navigation list.
  isFirst: boolean;

  // Flag indicating if the current position is the last position in the navigation list.
  isLast: boolean;

  // The current position in the render dialog.
  current: PositionInput;

  // Reference to the list of position used to navigate from this render dialog.
  private _navList: PositionInput[];

  /**
   * Creates an instance of ModelRenderDialogComponent.
   * @param {MatDialog} _dialog
   * @param {PositionRedererService} _positionRedererService
   * @param {IRenderDialogArgs} data
   * @param {PositionInputEditorService} _positionInputEditorService
   * @memberof ModelRenderDialogComponent
   */
  constructor(private _dialog: MatDialog, private _positionRedererService: PositionRedererService, @Inject(MAT_DIALOG_DATA) public data: IRenderDialogArgs, private _positionInputEditorService: PositionInputEditorService) {
    this.current = data.current;

    this.positions.push(this.current);
    this._navList = data.navList;

    const index: number = this._navList.indexOf(this.current);
    this.isFirst = index === 0;
    this.isLast = index === (this._navList.length - 1);

    let rederedModelInstance = this._positionRedererService.renderModel(this.current);

    this.scenarios.push(...rederedModelInstance.scenarios);

    this._positionInputEditorService.AddedPosition.subscribe(response => {
      if (response && response.position) {
        this.changePositionAndRender(response.position);
      }
    });

    this._positionInputEditorService.UpdatedPosition.subscribe(response => {
      if (response && response.position) {
        this.changePositionAndRender(response.position);
      }
    });
  }

  /**
   * Change the position and render it.
   *
   * @param {PositionInput} position The position to change to and render
   * @memberof ModelRenderDialogComponent
   */
  changePositionAndRender(position: PositionInput) {
    this.current = position;

    this.positions = [];
    this.positions.push(position);

    let rederedModelInstance = this._positionRedererService.renderModel(position);

    this.scenarios = [];
    this.scenarios.push(...rederedModelInstance.scenarios);

    this._positionInputTable?.renderRows();
    this._scenarioTable?.renderRows();
  }

  /**
   * Display the lots dialog.
   *
   * @param {PositionScenarioLot[]} lots The lots to display in the lots dialog.
   * @memberof ModelRenderDialogComponent
   */
  openLotsDialog(lots: PositionScenarioLot[]) {
    const dialogRef = this._dialog.open(ScenarioLotsDialogComponent, {
      data: lots
    });

    dialogRef.updateSize("900px", "auto");
    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });
  }

  /**
   * Display the fees dialog.
   *
   * @param {PositionScenarioFees} fees The fees to display in the fees dialog.
   * @memberof ModelRenderDialogComponent
   */
  openFeesDialog(fees: PositionScenarioFees) {
    const dialogRef = this._dialog.open(ScenarioFeesDialogComponent, {
      data: fees
    });

    dialogRef.updateSize("900px", "auto");
    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });
  }

  /**
   * Open the position input editor to edit the supplied position.
   *
   * @param {PositionInput} position The position to edit.
   * @memberof ModelRenderDialogComponent
   */
  openEditPositionDialog(position: PositionInput) {
    this._positionInputEditorService.openEditPositionDialog(position, SaveActionFlags.SaveAndClose);
  }

  /**
   * Open the position input editor to duplicate the supplied position.
   *
   * @param {PositionInput} position The position to duplicate.
   * @memberof ModelRenderDialogComponent
   */
  openDuplicateModelDialog(position: PositionInput) {
    this._positionInputEditorService.openDuplicateModelDialog(position, SaveActionFlags.SaveAndClose);
  }

  /**
   * Navigate to the position at the specified index and render.
   *
   * @private
   * @param {number} index The index of the position to navigate to.
   * @memberof ModelRenderDialogComponent
   */
  private navToPositionAndRender(index: number) {
    if ((this._navList.length > 0) && (0 <= index) && (index < this._navList.length)) {
      this.changePositionAndRender(this._navList[index]);
      this.isFirst = index === 0;
      this.isLast = index === (this._navList.length - 1);
    } else {
      this.isFirst = false;
      this.isLast = false;
    }
  }

  /**
   * Navigate to the first position and render the position.
   * 
   * @memberof ModelRenderDialogComponent
   */
  navToFirstPositionAndRender() {
    this.navToPositionAndRender(0);
  }

  /**
   * Navigate to the previous position and render the position.
   *
   * @memberof ModelRenderDialogComponent
   */
  navToPreviousPositionAndRender() {
    const index = this._navList.findIndex(element => {
      return element.id === this.current.id;
    });

    this.navToPositionAndRender(index - 1);
  }

  /**
   * Navigate to the next position and render the position.
   *
   * @memberof ModelRenderDialogComponent
   */
  navToNextPositionAndRender() {
    const index = this._navList.findIndex(element => {
      return element.id === this.current.id;
    });

    this.navToPositionAndRender(index + 1);
  }

  /**
   * Navigate to the last position and render the position.
   *
   * @memberof ModelRenderDialogComponent
   */
  navToLastPositionAndRender() {
    this.navToPositionAndRender(this._navList.length - 1)
  }
}
