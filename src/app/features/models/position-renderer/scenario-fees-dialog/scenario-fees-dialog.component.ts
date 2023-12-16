import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PositionScenarioFees } from 'src/app/shared/models/position-scenario-fees';

/**
 * Component to manage the display of a position's scenario fee detail.
 *
 * @export
 * @class ScenarioFeesDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-fees-dialog',
  templateUrl: './scenario-fees-dialog.component.html',
  styleUrls: ['./scenario-fees-dialog.component.scss']
})
export class ScenarioFeesDialogComponent {
  /**
   * Columns to display in the UI table.
   *
   * @type {string[]}
   * @memberof ScenarioFeesDialogComponent
   */
  modelOutputDisplayColumns: string[] = [
    'feesSinglePositionDaily',
    'feesAllPositionsDaily',
    'feesWeekly',
    'feesMonthly',
    'feesYearly',
  ];

  /**
   * Position's scenario lot data to display in UI table.
   *
   * @memberof ScenarioFeesDialogComponent
   */
  dataSource = new MatTableDataSource<PositionScenarioFees>();

  /**
   * Creates an instance of ScenarioFeesDialogComponent.
   * @param {PositionScenarioFees} data
   * @memberof ScenarioFeesDialogComponent
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: PositionScenarioFees) {
    this.dataSource.data.push(data);
  }
}
