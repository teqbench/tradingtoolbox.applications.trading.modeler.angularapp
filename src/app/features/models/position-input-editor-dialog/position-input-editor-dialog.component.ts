import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { TextFieldValidator } from 'src/app/core/validators/text-field.validator';
import { PositionInputDto } from 'src/app/shared/models/dtos/position-input-dto';
import { IPatch, ReplacePatch } from 'src/app/shared/models/http/patch';
import { PositionInput, IPositionInput } from 'src/app/shared/models/position-input';
import { PositionRepositoryService } from 'src/app/shared/services/position-repository.service';

/**
 * The response type returned when add, edit or duplicate a single position.
 *
 * @export
 * @interface IEditModelResponse
 */
export interface IEditModelResponse {
  position: PositionInput;
  saveActionFlags: SaveActionFlags;
}

/**
 * The response type returned when editing mulitple positions.
 *
 * @export
 * @interface IEditMultipleModelsResponse
 * @extends {IEditModelResponse}
 */
export interface IEditMultipleModelsResponse extends IEditModelResponse {
  positions: PositionInput[];
}

/**
 * The availabe modes for the position input editor.
 *
 * @export
 * @enum {number}
 */
export enum EditorModeType {
  AddOne,                                   // Can add ONE position at a time in this mode.
  DuplicateOne,                             // Can duplicate ONE position at a time in this mode.
  EditOne,                                  // Can edit ONE position at a time in this mode.
  EditMultiple                              // Can edit MULTIPLE positions at a time in this mode.
}

/**
 * The available save actions for th position input editor; it's possible to display a combination of
 * the save buttons based on these flags.
 *
 * @export
 * @enum {number}
 */
export enum SaveActionFlags {
  SaveAndClose = 1 << 0,                    // 1
  SaveAndAddAnother = 1 << 1,               // 2
  SaveAndDuplicate = 1 << 2,                // 4
  SaveAndRender = 1 << 3                    // 8
}

/**
 * Arguments used to initialized the position input editor.
 *
 * @export
 * @interface IEditorArgs
 */
export interface IEditorArgs {
  editorMode: EditorModeType,               // Used to determine the edit mode of the editor when first display
  modelInput?: PositionInput;               // Used only for add/edit/duplicating ONE position
  ids?: string[];                           // Used only for editing MULTIPLE positions
  saveActionFlags: SaveActionFlags          // Bitmask flags determining which save buttons to display
}

/**
 * Used to help keep track of which fields where selected by the user to change when editing multiple positions.
 *
 * @enum {number}
 */
enum FieldKeysType {
  ModelName,
  InitialPositionValue,

  PricePerShare,

  AverageNumberOfPositionsPerDay,
  AverageNumberOfLotsPerPosition,
  AverageNumberOfTradingDaysPerWeek,
  EstimatedSuccessRate,

  TargetGain,

  FederalTaxRate,
  StateTaxRate,
  Fees,
  Expenses
}

/**
 * Interface to help with the display of tax values in the drop down input controls for taxes..
 *
 * @interface Tax
 */
interface Tax {
  value: string;
  viewValue: string;
}

/**
 * Interface to help with the display of tax groups in the drop down input controls for taxes.
 *
 * @interface TaxGroup
 */
interface TaxGroup {
  disabled?: boolean;
  name: string;
  taxes: Tax[];
}

/**
 * Component to manage the editing of a position; editing includes add one position, editing one position,
 * duplicating one position and editing multiple positions.
 *
 * @export
 * @class EditModelDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-position-input-editor-dialog',
  templateUrl: './position-input-editor-dialog.component.html',
  styleUrls: ['./position-input-editor-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditModelDialogComponent implements OnInit {
  // Expose enum to HTML template.
  FieldKeysType: typeof FieldKeysType = FieldKeysType;
  SaveActionFlags: typeof SaveActionFlags = SaveActionFlags;

  form: FormGroup;

  // The position to be worked on
  position: PositionInput = new PositionInput();

  // The dialog's icon is determined based on the edit mode supplied as part of intialization and updated in the HTML template.
  icon: string;

  // The dialog's title is determined based on the edit mode supplied as part of intialization and updated in the HTML template.
  public title: string = "";

  // When editing multiple, this is the list of postion IDs to apply changes to when saving.
  ids: string[] = [];

  // List of values for fed taxes. Should ultimately come from a file or service.
  federalTaxGroups: TaxGroup[] = [
    {
      name: "Long Term Capital Gains",
      taxes: [
        { value: '0', viewValue: '0% - Single ($0 - $40,000), Married ($0 - $80,800), HoH ($0 - $54,100)' },
        { value: '0.15', viewValue: '15% - Single ($40,001 - $445,850), Married ($80,801 - $501,600), HoH ($54,101 - $473,750)' },
        { value: '0.2', viewValue: '20% - Single ($445,851+), Married ($501,601+), HoH ($473,751+)' }
      ]
    },
    {
      name: "Short Term Capital Gains",
      taxes: [
        { value: '0.1', viewValue: '10% - Single ($0 - $9,950), Married ($0 - $19,00), HoH ($0 - $14,200)' },
        { value: '0.12', viewValue: '12% - Single ($$9,950 - $40,525), Married ($19,901 - $81,050), HoH ($14,201 - $54,200)' },
        { value: '0.22', viewValue: '22% - Single ($40,526 - $86,375), Married ($81,051 - $172,750), HoH ($54,201 - $86,350)' },
        { value: '0.24', viewValue: '24% - Single ($86,376 - $164,925), Married ($172,751 - $329,850), HoH ($86,351 - $164,900)' },
        { value: '0.32', viewValue: '32% - Single ($164,926 - $209,425), Married ($329,851 - $418,850), HoH ($164,901 - $209,400)' },
        { value: '0.35', viewValue: '35% - Single ($209,426 - $523,600), Married ($418,851 - $628,300), HoH ($209,401 - $523,600)' },
        { value: '0.37', viewValue: '37% - Single ($523,601+), Married ($628,301+), HoH ($523,601+)' }
      ]
    }
  ];

  // List of values for state taxes. Should ultimately come from a file or service.
  stateTaxGroups: TaxGroup[] = [
    {
      name: 'No State Taxes',
      taxes: [
        { value: '0', viewValue: '0%' }
      ]
    },
    {
      name: 'Montana',
      taxes: [
        { value: '0.01', viewValue: '1% - Tax Bracket: $0.00+' },
        { value: '0.02', viewValue: '2% - Tax Bracket: $3,100.00+' },
        { value: '0.03', viewValue: '3% - Tax Bracket: $5,400.00+' },
        { value: '0.04', viewValue: '4% - Tax Bracket: $8,200.00+' },
        { value: '0.05', viewValue: '5% - Tax Bracket: $11,100.00+' },
        { value: '0.06', viewValue: '6% - Tax Bracket: $14,300.00+' },
        { value: '0.069', viewValue: '6.9% - Tax Bracket: $18,400.00+' }
      ]
    }
  ];

  // List of the fields used for editing multiple models at once as part of the selection tracking of
  // which fields to edit and apply to the selected models.
  private readonly _multpleEditIncludes: FieldKeysType[] = [
    FieldKeysType.PricePerShare,

    FieldKeysType.AverageNumberOfPositionsPerDay,
    FieldKeysType.AverageNumberOfLotsPerPosition,
    FieldKeysType.AverageNumberOfTradingDaysPerWeek,
    FieldKeysType.EstimatedSuccessRate,

    FieldKeysType.TargetGain,

    FieldKeysType.FederalTaxRate,
    FieldKeysType.StateTaxRate,
    FieldKeysType.Fees,
    FieldKeysType.Expenses
  ];

  selection = new SelectionModel<FieldKeysType>(true, []);

/**
 * Creates an instance of EditModelDialogComponent.
 *
 * @param {PositionRepositoryService} _positionRepositoryService Service to manage saving data to the DB repository.
 * @param {MatDialogRef<EditModelDialogComponent>} _dialogRef Reference to the MatDialog service to help with display of modal dialogs.
 * @param {FormBuilder} _fb The formbuilder control to help with the management of the input editor's form.
 * @param {IEditorArgs} args The input editor arguments to intialize the editor with.
 * @memberof EditModelDialogComponent
 */
constructor(private _positionRepositoryService: PositionRepositoryService, private _dialogRef: MatDialogRef<EditModelDialogComponent>, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public args: IEditorArgs) {
    // Get the position to be worked on from the args.
    this.position = new PositionInput(args.modelInput);

    // Prep the UI based on the editor mode from the args.
    switch (args.editorMode) {
      case EditorModeType.AddOne: {
        this.icon = "add_circle_outline";
        this.title = "Add New Position";

        break;
      }
      case EditorModeType.DuplicateOne: {
        this.icon = "content_copy";
        this.title = "Duplicate Position - " + args.modelInput?.name;

        // For a duplicate, clear the id/name before displaying the editor. In effect, adding a 'new' position
        // with all but the id/name fields populated. New id value will be assigned when saved to the DB (by the db)
        this.position.id = "";
        this.position.name = "";

        break;
      }
      case EditorModeType.EditOne: {
        this.icon = "app_registration";
        this.title = "Edit Position - " + args.modelInput?.name;
        break;
      }
      case EditorModeType.EditMultiple: {
        this.icon = "app_registration";
        this.title = "Edit Selected Positions";

        // Ensure the position used for editing multiple starts off with default values
        this.position = new PositionInput();
        this.ids = args.ids ? args.ids : [];

        break;
      }
    }

    // Use a local var for the flag vs using the property because the value of prop is calculated and only need the real value once in the constructor
    const isDisabled: boolean = this.isEditingMultiple;

    // NOTE: the checkboxes used as part of the 'edit multiple' models mode are NOT included in the form group because
    // they would then be included as part of validation of the form; they really only need to be used to all the user
    // to edit the associated input control so just use them to control the disabled state of the associated input control.

    this.form = this._fb.group({
      modelName: [{ value: this.position.name, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50), TextFieldValidator.cannotContainLeadingWhitespace, TextFieldValidator.cannotContainTrailingWhitespace]],
      initialValue: [{ value: this.position.initialValue, disabled: false }, [Validators.required, Validators.min(0.01), Validators.max(10000000)]],
      pricePerShare: [{ value: this.position.pricePerShare, disabled: isDisabled }, [Validators.required, Validators.min(0.0000000000000001), Validators.maxLength(1000000)]],
      numberOfSharesInPosition: [{ value: this.position.numberOfSharesInPosition, disabled: isDisabled }],
      averageNumberOfPositionsPerDay: [{ value: this.position.averageNumberOfPositionsPerDay, disabled: isDisabled }, [Validators.required, Validators.min(1), Validators.max(24)]],
      averageNumberOfLotsPerPosition: [{ value: this.position.averageNumberOfLotsPerPosition, disabled: isDisabled }, [Validators.required, Validators.min(1), Validators.max(100)]],
      averageNumberOfTradingDaysPerWeek: [{ value: this.position.averageNumberOfTradingDaysPerWeek, disabled: isDisabled }, [Validators.required, Validators.min(1), Validators.max(7)]],
      estimatedSuccessRate: [{ value: this.position.estimatedSuccessRate, disabled: isDisabled }, [Validators.required, Validators.min(0), Validators.max(1)]],
      targetGain: [{ value: this.position.targetGain, disabled: isDisabled }, [Validators.required, Validators.min(0), Validators.max(1)]],
      federalTaxRate: [{ value: String(this.position.federalTaxRate), disabled: isDisabled }, [Validators.required]],
      stateTaxRate: [{ value: String(this.position.stateTaxRate), disabled: isDisabled }, [Validators.required]],
      fees: [{ value: this.position.estimatedFeePerTransaction, disabled: isDisabled }, [Validators.required, Validators.min(0), Validators.max(100000)]],
      expenses: [{ value: this.position.expenses, disabled: isDisabled }, [Validators.required, Validators.min(0), Validators.max(100000)]],
    });

    // Some validators need to be removed if editing multiple because not editable/visible to the user.
    if (this.isEditingMultiple) {
      const modelName = this.form.controls["modelName"];
      const initialValue = this.form.controls["initialValue"];

      modelName.setValidators(null);
      modelName.updateValueAndValidity();

      initialValue.setValidators(null);
      initialValue.updateValueAndValidity();

      this.form.updateValueAndValidity();
    }
  }

  /**
   * Event fired when checkbox with an associated/paired input control has been checked/unchecked.
   *
   * @param {MatCheckboxChange} event The source of the event.
   * @param {FieldKeysType} fieldKey The identifier of the field used to as part of keeping track of what's selected.
   * @param {string} pairedControlName The name of the paired input control to enable/disable in association with the checkbox.
   * @memberof EditModelDialogComponent
   */
  onIncludeCheckboxChange(event: MatCheckboxChange, fieldKey: FieldKeysType, pairedControlName: string) {
    // THIS SHOULD ONLY APPLY WHEN EDITING MULTIPLE SINCE THAT'S ONLY WHEN
    // THE CHECKBOXES ARE AVAILABLE TO THE USER.
    this.selection.toggle(fieldKey);
    const pairedControl = this.form.get(pairedControlName);

    // If checked, validate the paired control
    // If not checked, clear any errors on the paired control
    if (event.source.checked) {
      pairedControl?.enable();

      // Enabling the control when it's a slider or select for some reason does not trigger validation.
      // Tried to use 'markAllAsTouched' but didn't work to cause update to validation state, but calling
      // 'markAsDirty' will.
      if ((pairedControl as unknown as MatSlider) || (pairedControl as unknown as MatSelect)) {
        pairedControl?.markAsDirty();
      }
    } else {
      pairedControl?.disable();
    }
  }

  /**
   * Property indicating if the reset button is enabled or not.
   *
   * @return {*}  {boolean} True if disable, false otherwise.
   * @memberof EditModelDialogComponent
   */
  public get isResetDisabled(): boolean {
    return !this.form.dirty;
  }

  /**
   * Property indicating if the save and close button is enabled or not.
   *
   * @return {*}  {boolean} True if disable, false otherwise.
   * @memberof EditModelDialogComponent
   */
  public get isSaveDisabled(): boolean {
    if (this.isEditingMultiple) {
      return !this.selection.hasValue() || (this.form.invalid || (this.form.valid && !this.form.dirty));
    } else {
      return this.form.invalid || (this.form.valid && !this.form.dirty);
    }
  }

  /**
   * Property indicating if the save and add another button is enabled or not.
   *
   * @return {*}  {boolean} True if disable, false otherwise.
   * @memberof EditModelDialogComponent
   */
  public get isSaveAndAddAnotherDisabled(): boolean {
    return (this.form.invalid || (this.form.valid && !this.form.dirty)) && !this.isEditingMultiple;
  }

  /**
   * Property indicating if the save and duplicate button is enabled or not.
   *
   * @return {*}  {boolean} True if disable, false otherwise.
   * @memberof EditModelDialogComponent
   */
  public get isSaveAndDuplicateDisabled(): boolean {
    return (this.form.invalid || (this.form.valid && !this.form.dirty)) && !this.isEditingMultiple;
  }

  /**
   * Property indicating if the save and render button is enabled or not.
   *
   * @return {*}  {boolean} True if disable, false otherwise.
   * @memberof EditModelDialogComponent
   */
  public get isSaveAndRenderDisabled(): boolean {
    return (this.form.invalid || (this.form.valid && !this.form.dirty)) && !this.isEditingMultiple;
  }

  /**
   * A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for
   * the first time, and before any of the view or content children have been checked. It is invoked only once when the directive is instantiated.
   *
   * @memberof EditModelDialogComponent
   */
  ngOnInit(): void {
    // Setup obervers
    this.form.get('modelName')?.valueChanges.subscribe(value => {
      this.position.name = value;
    });

    this.form.get('initialValue')?.valueChanges.subscribe(value => {
      this.position.initialValue = value;
    });
    this.form.get('pricePerShare')?.valueChanges.subscribe(value => {
      this.position.pricePerShare = value;
    });

    this.form.get('fees')?.valueChanges.subscribe(value => {
      this.position.estimatedFeePerTransaction = value;
    });

    this.form.get('averageNumberOfPositionsPerDay')?.valueChanges.subscribe(value => {
      this.position.averageNumberOfPositionsPerDay = value;
    });

    this.form.get('averageNumberOfLotsPerPosition')?.valueChanges.subscribe(value => {
      this.position.averageNumberOfLotsPerPosition = value;
    });

    this.form.get('averageNumberOfTradingDaysPerWeek')?.valueChanges.subscribe(value => {
      this.position.averageNumberOfTradingDaysPerWeek = value;
    });

    this.form.get('estimatedSuccessRate')?.valueChanges.subscribe(value => {
      this.position.estimatedSuccessRate = value;
    });

    this.form.get('targetGain')?.valueChanges.subscribe(value => {
      this.position.targetGain = value;
    });

    this.form.get('expenses')?.valueChanges.subscribe(value => {
      this.position.expenses = value;
    });
  }

  // /**
  //  * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
  //  *
  //  * @param {MatSliderChange} event The source of the change.
  //  * @memberof EditModelDialogComponent
  //  */
  // onAverageNumberOfPositionsPerDayInputChange(event: MatSliderChange) {
  //   this.position.averageNumberOfPositionsPerDay = event.value ? event.value : 1;
  // }

  // /**
  //  * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
  //  *
  //  * @param {MatSliderChange} event The source of the change.
  //  * @memberof EditModelDialogComponent
  //  */
  // onAverageNumberOfLotsPerPositionInputChange(event: MatSliderChange) {
  //   this.position.averageNumberOfLotsPerPosition = event.value ? event.value : 1;
  // }

  /**
   * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
   *
   * @param {MatSliderChange} event The source of the change.
   * @memberof EditModelDialogComponent
   */
  // onAverageNumberOfTradingDaysPerWeekInputChange(event: MatSliderChange) {
  //   this.position.averageNumberOfTradingDaysPerWeek = event.value ? event.value : 5;
  // }

  /**
   * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
   *
   * @param {MatSliderChange} event The source of the change.
   * @memberof EditModelDialogComponent
   */
  // onEstimatedSuccessRateInputChange(event: MatSliderChange) {
  //   this.position.estimatedSuccessRate = event.value ? event.value : 0;
  // }

  /**
   * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
   *
   * @param {MatSliderChange} event The source of the change.
   * @memberof EditModelDialogComponent
   */
  // onTargetGainInputChange(event: MatSliderChange) {
  //   this.position.targetGain = event.value ? event.value : 0;
  // }

  /**
   * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
   *
   * @param {*} event The source of the change.
   * @memberof EditModelDialogComponent
   */
  onFederalTaxRateInputChange(event: any) {
    this.position.federalTaxRate = event.value ? Number(event.value) : 0.37;
  }

  /**
   * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
   *
   * @param {*} event The source of the change.
   * @memberof EditModelDialogComponent
   */
  onStateTaxRateInputChange(event: any) {
    this.position.stateTaxRate = event.value ? Number(event.value) : 0;
  }

  // /**
  //  * Update position value from UI when changes to the position instance variable updates calculated values on the fly.
  //  *
  //  * @param {MatSliderChange} event The source of the change.
  //  * @memberof EditModelDialogComponent
  //  */
  // onExpensesInputChange(event: MatSliderChange) {
  //   this.position.expenses = event.value ? event.value : 0;
  // }

  /**
   * Reset the input editor form.
   *
   * @memberof EditModelDialogComponent
   */
  onResetClick() {
    this.position = new PositionInput(this.args.modelInput);

    this.form.reset({
      modelName: this.position.name,

      initialValue: this.position.initialValue,
      pricePerShare: this.position.pricePerShare,
      numberOfSharesInPosition: this.position.numberOfSharesInPosition,

      averageNumberOfPositionsPerDay: this.position.averageNumberOfPositionsPerDay,
      averageNumberOfLotsPerPosition: this.position.averageNumberOfLotsPerPosition,

      averageNumberOfTradingDaysPerWeek: this.position.averageNumberOfTradingDaysPerWeek,
      estimatedSuccessRate: this.position.estimatedSuccessRate,

      targetGain: this.position.targetGain,

      federalTaxRate: String(this.position.federalTaxRate),
      stateTaxRate: String(this.position.stateTaxRate),

      fees: this.position.estimatedFeePerTransaction,

      expenses: this.position.expenses
    });

    if (this.isEditingMultiple) {
      this.masterToggle(true);
    }
  }

  /**
   * Cancels any add, edit or duplication of the position and closes the dialog.
   *
   * @memberof EditModelDialogComponent
   */
  onCancelClick() {
    this._dialogRef.close();
  }

  /**
   * Saves the current position and closes the dialog.
   *
   * @param {SaveActionFlags} saveActionFlags The save action flags the dialog was initialized with.
   * @return {*}
   * @memberof EditModelDialogComponent
   */
  onSaveClick(saveActionFlags: SaveActionFlags) {
    let value: PositionInputDto = new PositionInputDto(this.position as IPositionInput);

    // The underlying save is determined by the edit mode of the dialog.
    switch (this.args.editorMode) {
      case EditorModeType.AddOne:
      case EditorModeType.DuplicateOne: {
        // Both add and duplicate will create a NEW document in the repository and use the same underlying save method of the service.
        return this._positionRepositoryService
          .createPositionDocument(value)
          .subscribe({
            next: data => {
              this._dialogRef.close({
                position: new PositionInput(data),
                saveActionFlags: saveActionFlags
              });
            }
          });
      }
      case EditorModeType.EditOne: {
        return this._positionRepositoryService
          .updatePositionDocument(value)
          .subscribe({
            next: data => {
              this._dialogRef.close({
                position: new PositionInput(data),
                saveActionFlags: saveActionFlags
              });
            }
          });
      }
      case EditorModeType.EditMultiple: {
        let patches: IPatch<any>[] = [];

        // When saving the edits for multiple models, have to determine which
        // fields the user wants to update and apply the updated value stored in the 'value' position instance
        // to the position instance to be updated.
        this.selection.selected.forEach(key => {
          switch (key) {
            case FieldKeysType.PricePerShare: {
              patches.push(new ReplacePatch("/pricePerShare", value.pricePerShare));
              break;
            }
            case FieldKeysType.AverageNumberOfPositionsPerDay: {
              patches.push(new ReplacePatch("/averageNumberOfPositionsPerDay", value.averageNumberOfPositionsPerDay));
              break;
            }
            case FieldKeysType.AverageNumberOfLotsPerPosition: {
              patches.push(new ReplacePatch("/averageNumberOfLotsPerPosition", value.averageNumberOfLotsPerPosition));
              break;
            }
            case FieldKeysType.AverageNumberOfTradingDaysPerWeek: {
              patches.push(new ReplacePatch("/averageNumberOfTradingDaysPerWeek", value.averageNumberOfTradingDaysPerWeek));
              break;
            }
            case FieldKeysType.EstimatedSuccessRate: {
              patches.push(new ReplacePatch("/estimatedSuccessRate", value.estimatedSuccessRate));
              break;
            }
            case FieldKeysType.TargetGain: {
              patches.push(new ReplacePatch("/targetGain", value.targetGain));
              break;
            }
            case FieldKeysType.FederalTaxRate: {
              patches.push(new ReplacePatch("/federalTaxRate", value.federalTaxRate));
              break;
            }
            case FieldKeysType.StateTaxRate: {
              patches.push(new ReplacePatch("/stateTaxRate", value.stateTaxRate));
              break;
            }
            case FieldKeysType.Fees: {
              patches.push(new ReplacePatch("/estimatedFeePerTransaction", value.estimatedFeePerTransaction));
              break;
            }
            case FieldKeysType.Expenses: {
              patches.push(new ReplacePatch("/expenses", value.expenses));
              break;
            }
          }
        });

        // Volume could be a problem...so just a heads up this might need some level of refactoring later for performance reasons
        return this._positionRepositoryService
          .updatePositionDocuments(this.ids, patches)
          .subscribe({
            next: data => {
              this._dialogRef.close({
                positions: data,
                saveActionFlags: SaveActionFlags.SaveAndClose
              });
            }
          });
      }
    }
  }

  /**
   * Property indicating if editing multiple positions or not.
   *
   * @readonly
   * @type {boolean} True, editing multiple positions, otherwise false and editing/adding/duplicating a single position
   * @memberof EditModelDialogComponent
   */
  public get isEditingMultiple(): boolean {
    return this.args.editorMode === EditorModeType.EditMultiple;
  }

  /**
   * Property indicating to show the save and add another button or not.
   *
   * @readonly
   * @type {boolean} True, display, false hide.
   * @memberof EditModelDialogComponent
   */
  public get showSaveAndAddAnotherButton(): boolean {
    return (this.args.saveActionFlags & SaveActionFlags.SaveAndAddAnother) === SaveActionFlags.SaveAndAddAnother;
  }

  /**
   * Property indicating to show the save and duplicate button or not.
   *
   * @readonly
   * @type {boolean} True, display, false hide.
   * @memberof EditModelDialogComponent
   */
  public get showSaveAndDuplicateButton(): boolean {
    return (this.args.saveActionFlags & SaveActionFlags.SaveAndDuplicate) === SaveActionFlags.SaveAndDuplicate;
  }

  /**
   * Property indicating to show the save and render button or not.
   *
   * @readonly
   * @type {boolean} True, display, false hide.
   * @memberof EditModelDialogComponent
   */
  public get showSaveAndRenderButton(): boolean {
    return (this.args.saveActionFlags & SaveActionFlags.SaveAndRender) === SaveActionFlags.SaveAndRender;
  }

  /**
   * Property indicating if the number of selected elements matches the total number of rows.
   *
   * @readonly
   * @type {boolean} True if all are selected, otherwise returns false.
   * @memberof EditModelDialogComponent
   */
  public get isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this._multpleEditIncludes.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   * @param {boolean} [forceClear=false] Flag to force clear of selected rows from code. Default is false.
   * @return {*}
   * @memberof EditModelDialogComponent
   */
  masterToggle(forceClear: boolean = false) {
    if (this.isAllSelected || forceClear) {
      // De-select all and disable all input fields associated with the checkbox
      this.selection.clear();

      // When clearing the selections, disable all the edit/input controls as user will
      // need to re-select which controls to include.
      Object.keys(this.form.controls).forEach(key => {
        this.form.controls[key].disable();
      });
      return;
    }

    // Select all and enable all input fields associated with the checkbox
    this.selection.select(...this._multpleEditIncludes);

    // When selecting all, disable all the edit/input controls.
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].enable();
    });
  }
}
