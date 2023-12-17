import { } from '@angular/material'
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, of as observableOf } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Import models
import { PositionInput } from '../../shared/models/position-input';
import { MultiPatchItem, ReplacePatch } from 'src/app/shared/models/http/patch';

// Import components
import { ConfirmationDialogArgs } from '../../core/components/confirmation-dialog/confirmation-dialog.component';

// Import Services
import { ConfirmationDialogService } from '../../core/services/confirmation-dialog.service';
import { NotificationService } from '../../core/services/notification.service';
// import { SaveActionFlags } from 'src/app/shared/services/position-input-editor.service';
import { PositionRepositoryService } from '../../shared/services/position-repository.service';
import { ThemeService, ThemeType, ThemeChangedEventArgs } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Save action flags used for add, edit (one) and duplication (one) edit modes.
  // private readonly SAVE_ACTION_FLAGS: SaveActionFlags = SaveActionFlags.SaveAndClose | SaveActionFlags.SaveAndAddAnother | SaveActionFlags.SaveAndDuplicate | SaveActionFlags.SaveAndRender;

  // Subscription for HTTP service calls.
  private _httpSubscription: Subscription | undefined;

  isDarkThemeActive: boolean = false;

  // Expose enum to HTML template.
  // ModelEditorModeType: typeof EditorModeType = EditorModeType;
  dataSource: MatTableDataSource<PositionInput> = new MatTableDataSource();
  filter: string = "";

// Keeps track of which positions are selected in the table (by checkbox)
selection = new SelectionModel<PositionInput>(true, []);

    // Reference to UI table used to refresh rows.
    @ViewChild(MatTable) _dashboardTable: MatTable<any> | undefined;

// List of columns to display in the UI table.
displayedColumns: string[] = [
  'botIndicator',
  'select',
  'initialValue',
  'pricePerShare',
  'sizeOfPosition',
  'averageNumberOfSharesPerLot',
  'averageNumberOfPositionsPerDay',
  'averageNumberOfLotsPerPosition',
  'estimatedSuccessRate',
  'averageNumberOfTradingDaysPerWeek',
  'targetGain',
  'averageGainPerLot',
  'expenses',
  // 'actions'
];

    /**
   * Creates an instance of DashboardComponent.
   * @param {PositionRepositoryService} _positionRepositoryService Service to interface with the position DB respository.
   * @param {MatDialog} dialog Service to open Material Design modal dialogs.
   * @param {ConfirmationDialogService} _confirmationDialogService Service managing display of confirmation dialogs.
   * @param {NotificationService} _notificationService Service managing display of notifications.
   * @param {ThemeService} _themeService Service managing theme switching.
   * @memberof DashboardComponent
   */
  constructor(private _positionRepositoryService: PositionRepositoryService, private dialog: MatDialog, private _confirmationDialogService: ConfirmationDialogService, private _notificationService: NotificationService, private _themeService: ThemeService) {
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   *
   * @memberof DashboardComponent
   */
  ngOnDestroy(): void {
    // Clean up resources.

    // Unsubscribe from subscriptions.
    if (this._httpSubscription) {
      this._httpSubscription.unsubscribe();
    }
  }

  /**
   * Componenet initialization after data bound properties are checked.
   *
   * @memberof DashboardComponent
   */
  ngOnInit(): void {
    this._themeService.onThemeChanged.subscribe(x => this.onThemeChanged(x));
    this._themeService.initialize();
  }

    /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   *
   * @memberof DashboardComponent
   */
    ngAfterViewInit(): void {
      this._httpSubscription = this._positionRepositoryService.getAllPositionDocuments()
        .subscribe({
          next: results => {
            this.dataSource.data = (results != null) ? results : [];
          }
        });
    }

  /**
   * Toggles the dark theme on/off based on the supplied checkbox checked state.
   *
   * @param {boolean} checked If true, darak theme is selected, if false, light theme is selected.
   * @memberof DashboardComponent
   */
  toggleTheme(checked: boolean) {
    this._themeService.setTheme(checked ? ThemeType.DarkTheme : ThemeType.LightTheme);
  }

  /**
   * Event handler for the theme changed event.
   *
   * @param {ThemeChangedEventArgs} args The values of the new, current theme.
   * @memberof DashboardComponent
   */
  onThemeChanged(args: ThemeChangedEventArgs) {
    this.isDarkThemeActive = args.theme === ThemeType.DarkTheme;

    // This article provided the final, missing elements (using CSS class to wrap the themes in styles.scss)
    // https://blog.knoldus.com/understanding-dynamic-theming-in-angular-material/
    // TODO: optimize.
    if (this.isDarkThemeActive) {
      document.body.classList.add(ThemeType.DarkTheme);
      document.body.classList.remove(ThemeType.LightTheme);
    } else {
      document.body.classList.add(ThemeType.LightTheme);
      document.body.classList.remove(ThemeType.DarkTheme);
    }
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @return {*}
   * @memberof DashboardComponent
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   * @return {*}
   * @memberof DashboardComponent
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.filteredData);
  }

  testConfirmationDialog() {
    let args: ConfirmationDialogArgs = new ConfirmationDialogArgs("Test Confirmation", "Does this test confirmation dialog work?");

    this._notificationService.close();

    this._confirmationDialogService.showDialog(args).subscribe(isConfirmed => {
      if (isConfirmed) {
        this._notificationService.success("Confirmed!!");
      } else {
        this._notificationService.warn("NOT Confirmed!!");
      }
    });
  }

  showSuccessSnackbar(): void {
    this._notificationService.success("This is a success snackbar!");
  }
  showInformationSnackbar(): void {
    this._notificationService.information("This is a information snackbar!");
  }
  showWarningSnackbar(): void {
    this._notificationService.warn("This is a warning snackbar!");
  }
  showErrorSnackbar(): void {
    this._notificationService.error("This is a error snackbar!");
  }
  showHelpSnackbar(): void {
    this._notificationService.help("This is a help snackbar!");
  }

  /**
   * Clears any applied filter.
   *
   * @memberof DashboardComponent
   */
  clearFilter() {
    this.filter = "";
    this.applyFilter();
  }

  /**
   * Applies new filter to the datasource.
   *
   * @memberof DashboardComponent
   */
  applyFilter() {
    // To avoid any sort of odd UI behavior of selections being hidden as filter is changing, just
    // clear any selections before new filter is applied.
    this.selection.clear();

    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filter.toLowerCase();
  }

  /**
   * If a filter is applied, returns true, otherwise returns false.
   *
   * @readonly
   * @type {boolean}
   * @memberof DashboardComponent
   */
  get isFilterApplied(): boolean {
    return (this.filter.trim().length > 0);
  }

 /**
   * If true, drag/drop is allowed, otherwise it is not.
   *
   * @readonly
   * @type {boolean}
   * @memberof DashboardComponent
   */
 get allowDragDrop(): boolean {
  // Do not allow to drag/drop if a filter has been applied.
  return !this.isFilterApplied;
}

/**
   * Drag/drop - dropped event which fires after a row is dropped at a new location in the table.
   *
   * @param {CdkDragDrop<PositionInput[]>} event The event source.
   * @memberof DashboardComponent
   */
onCdkDropListDropped(event: CdkDragDrop<PositionInput[]>) {
  // Get the correct start/end indexes to loop through.
  const startIndex: number = event.previousIndex <= event.currentIndex ? event.previousIndex : event.currentIndex;
  const endIndex: number = event.previousIndex <= event.currentIndex ? event.currentIndex : event.previousIndex;

  // Only update the ordering of items if the start/end indexes are different.
  if (startIndex != endIndex) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);

    let patchMultiple: MultiPatchItem[] = [];

    // Update the listPosition field of the elements that 'moved' due to drag/drop and update DB
    for (let i: number = startIndex; i <= endIndex; i++) {
      let item: MultiPatchItem = new MultiPatchItem();
      item.ids.push(this.dataSource.data[i].id);
      item.patchDocument.push(new ReplacePatch("/listPosition", i));

      // Just update the client model list position here so do not have to deal w/ the return values from the service call.
      this.dataSource.data[i].listPosition = i;

      patchMultiple.push(item);
    }

    this._positionRepositoryService
      .reorderPositionDocuments(patchMultiple)
      .subscribe({
        next: data => {
          ;
        }
      });

    this._dashboardTable?.renderRows();
    console.log(event.container.data);
  }
}
}
