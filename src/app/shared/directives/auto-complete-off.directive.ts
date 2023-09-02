import { Directive, ElementRef } from '@angular/core';

/**
 * Directive to turn off a browser's auto-complete feature on a per element basis.
 * Based on https://mecheri-akram.medium.com/how-to-disable-the-annoying-google-chrome-form-autocomplete-with-angular-bdcf213008b3
 * 
 * @export
 * @class AutoCompleteOffDirective
 */
@Directive({
  selector: '[autoCompleteOff]'
})
export class AutoCompleteOffDirective {
/**
 * Creates an instance of AutoCompleteOffDirective.
 * @param {ElementRef} _el - The HTML element to apply this directive on.
 * @memberof AutoCompleteOffDirective
 */
constructor(private _el: ElementRef) {
    this._el.nativeElement.setAttribute('autocomplete', 'off');
    this._el.nativeElement.setAttribute('autocorrect', 'off');
    this._el.nativeElement.setAttribute('autocapitalize', 'none');
    this._el.nativeElement.setAttribute('spellcheck', 'false');
  }
}
