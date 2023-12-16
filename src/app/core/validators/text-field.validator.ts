import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Text field validators.
 * 
 * Based on https://www.itsolutionstuff.com/post/angular-form-validation-no-whitespace-allowed-exampleexample.html
 * 
 * @export
 * @class TextFieldValidator
 */
export class TextFieldValidator {
  /**
   * Validator to ensure text field value does NOT have leading whitespace.
   *
   * @static
   * @param {AbstractControl} control The text field to apply this validation on.
   * @return {*}  {(ValidationErrors | null)} List of validation errors. If none, returns null.
   * @memberof TextFieldValidator
   */
  static cannotContainLeadingWhitespace(control: AbstractControl): ValidationErrors | null {
    let value = control.value as string;
    if (value.startsWith(' ')) {
      return {
        'trimError': { value: 'control value has leading whitespace.' }
      };
    }

    return null;
  }
  
  /**
   * Validator to ensure text field value does NOT have trailing whitespace.
   *
   * @static
   * @param {AbstractControl} control The text field to apply this validation on.
   * @return {*}  {(ValidationErrors | null)} List of validation errors. If none, returns null.
   * @memberof TextFieldValidator
   */
  static cannotContainTrailingWhitespace(control: AbstractControl): ValidationErrors | null {
    let value = control.value as string;
    if (value.endsWith(' ')) {
      return {
        'trimError': { value: 'control value has trailing whitespace.' }
      };
    }

    return null;
  }
}