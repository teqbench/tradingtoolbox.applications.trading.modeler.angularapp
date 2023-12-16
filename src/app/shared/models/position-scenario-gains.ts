/**
 * Rendered position scenario gains
 *
 * @export
 * @class PositionScenarioGains
 */
export class PositionScenarioGains {
    // Gains over the course of a day's worth of trading
    gainsDaily: number;

    // Gains over the course of a week's worth of trading
    gainsWeekly: number;

    // Gains over the course of a month's worth of trading
    gainsMonthly: number;

    // Gains over the course of a years's worth of trading
    gainsYearly: number;

    /**
     * Creates an instance of PositionScenarioGains.
     * @param {number} [daily] // Gains over the course of a day's worth of trading
     * @param {number} [weekly] // Gains over the course of a week's worth of trading
     * @param {number} [monthly] // Gains over the course of a month's worth of trading
     * @param {number} [yearly] // Gains over the course of a years's worth of trading
     * @memberof PositionScenarioGains
     */
    constructor(daily?: number, weekly?: number, monthly?: number, yearly?: number) {
        this.gainsDaily = daily ? daily : 0;
        this.gainsWeekly = weekly ? weekly : 0;
        this.gainsMonthly = monthly ? monthly : 0;
        this.gainsYearly = yearly ? yearly : 0;
    }
}