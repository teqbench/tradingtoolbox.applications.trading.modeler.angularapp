/**
 * Rendered position scenario fees
 *
 * @export
 * @class PositionScenarioFees
 */
export class PositionScenarioFees {
    // Fees for a single position over the course of a day's worth of trading
    feesSinglePositionDaily: number;

    // Fees for all positions over the course of a day's worth of trading
    feesAllPositionsDaily: number;

    // Fees for all positions over the course of a week's worth of trading
    feesWeekly: number;

    // Fees for all positions over the course of a month's worth of trading
    feesMonthly: number;

    // Fees for all positions over the course of a year's worth of trading
    feesYearly: number;

    /**
     * Creates an instance of PositionScenarioFees.
     * @param {number} [singlePositionDaily] Fees for a single position over the course of a day's worth of trading
     * @param {number} [allPositionsDaily] Fees for all positions over the course of a day's worth of trading
     * @param {number} [weekly] Fees for all positions over the course of a week's worth of trading
     * @param {number} [monthly] Fees for all positions over the course of a month's worth of trading
     * @param {number} [yearly] Fees for all positions over the course of a year's worth of trading
     * @memberof PositionScenarioFees
     */
    constructor(singlePositionDaily?: number, allPositionsDaily?: number, weekly?: number, monthly?: number, yearly?: number) {
        this.feesSinglePositionDaily = singlePositionDaily ? singlePositionDaily : 0;
        this.feesAllPositionsDaily = allPositionsDaily ? allPositionsDaily : 0;
        this.feesWeekly = weekly ? weekly : 0;
        this.feesMonthly = monthly ? monthly : 0;
        this.feesYearly = yearly ? yearly : 0;
    }
}