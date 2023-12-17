import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PositionScenarioLot } from '../../../../shared/models/position-scenario-lot';

/**
 * Component to manage the display of a position's scenario lot detail.
 *
 * @export
 * @class ScenarioLotsDialogComponent
 */
@Component({
  selector: 'app-lots-dialog',
  templateUrl: './scenario-lots-dialog.component.html',
  styleUrls: ['./scenario-lots-dialog.component.scss']
})
export class ScenarioLotsDialogComponent {
  /**
   * Columns to display in the UI table.
   *
   * @type {string[]}
   * @memberof ScenarioLotsDialogComponent
   */
  modelOutputDisplayColumns: string[] = [
    'lotNumber',
    'initialValue',
    'shareCount',
    'sellPrice',
    'value',
    'grossProfit'
  ];

  /**
   * Position's scenario lot data to display in UI table.
   *
   * @memberof ScenarioLotsDialogComponent
   */
  dataSource = new MatTableDataSource<PositionScenarioLot>(this.data);

  /**
   * Creates an instance of ScenarioLotsDialogComponent.
   *
   * @param {PositionScenarioLot[]} data Position's scenario lot data to display in UI table.
   * @memberof ScenarioLotsDialogComponent
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: PositionScenarioLot[]) {
  }

  /**
   * Gets the total initial value of the lot from the supplied data.
   *
   * @return {*}
   * @memberof ScenarioLotsDialogComponent
   */
  getTotalInitialValue() {
    return this.data.map(t => t.initialValue).reduce((acc, value) => acc + value, 0);
  }

  /**
   * Gets the total share count of the lot from the supplied data.
   *
   * @return {*}
   * @memberof ScenarioLotsDialogComponent
   */
  getTotalShareCount() {
    return this.data.map(t => t.shareCount).reduce((acc, value) => acc + value, 0);
  }

  /**
   * Gets the total gross profit of the lot from the supplied data.
   *
   * @return {*}
   * @memberof ScenarioLotsDialogComponent
   */
  getTotalGrossProfit() {
    return this.data.map(t => t.grossProfit).reduce((acc, value) => acc + value, 0);
  }
}
