import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/**
 * This pipe is intended to display a negative currency value with paranthesis instead of a "-" (USD accounting style) to be move obvious to end user.
 *
 * @export
 * @class CurrencyExtendedPipe
 * @extends {CurrencyPipe}
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'currencyExtended',
})
export class CurrencyExtendedPipe extends CurrencyPipe implements PipeTransform {
    /**
     * Transforms supplied value if a negative currency to use parenthesis, i.e. "(10)", instead of a dash, i.e. "-10", to represent a negative currency value.
     *
     * @param {*} value The value to transform.
     * @param {('code' | 'symbol' | 'symbol-narrow' | string | boolean)} [display] The format for the currency indicator.
     * @param {string} [digitsInfo] Decimal representation options.
     * @param {string} [locale] The locale code to use for the locale format rules to use.
     * @return {*}  {*} If a negative number, the value is transformed to use parenthesis, otherwise just returns the original value.
     * @memberof CurrencyExtendedPipe
     */
    override transform(value: any, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): any {
        let result: string | null = super.transform(value, undefined, display, digitsInfo, locale);

        // If wanted to make really robust, only use this transformation for currencies that support parenthesis for negative numbers
        // but since this is intended to be a private tool in US, it's OK for now.
        if (result && (result.substring(0, 1) === '-')) {
            return "(" + (result.replace(/-/g, '')) + ")"
        } else {
            return result;
        }
    }
}