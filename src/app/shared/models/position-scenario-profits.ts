/**
 * Rendered position scenario profits
 *
 * @export
 * @class PositionScenarioProfits
 */
export class PositionScenarioProfits {
    // Gross profit for a single position (i.e. before taxes, fees and success-rate adjustments) for a single position.
    grossSinglePosition: number;

    // Gross profit for a single position (i.e. before taxes, fees but after success-rate adjustments) for a single position.
    adjustedGrossSinglePosition: number;

    // Net profit for a single position (i.e. after taxes, fees and success-rate adjustments) for a single position.
    netSinglePosition: number;

    // Net profit for a all positions (i.e. after taxes, fees and success-rate adjustments) for a single position.
    netAllPositions: number;

    /**
     * Creates an instance of PositionScenarioProfits.
     * @param {number} [grossSinglePosition] Gross profit for a single position (i.e. before taxes, fees and success-rate adjustments) for a single position.
     * @param {number} [adjustedGrossSinglePosition] Gross profit for a single position (i.e. before taxes, fees but after success-rate adjustments) for a single position.
     * @param {number} [netSinglePosition] Net profit for a single position (i.e. after taxes, fees and success-rate adjustments) for a single position.
     * @param {number} [netAllPositions] Net profit for a all positions (i.e. after taxes, fees and success-rate adjustments) for a single position.
     * @memberof PositionScenarioProfits
     */
    constructor(grossSinglePosition?: number, adjustedGrossSinglePosition?: number, netSinglePosition?: number, netAllPositions?: number) {
        this.grossSinglePosition = grossSinglePosition ? grossSinglePosition : 0;
        this.adjustedGrossSinglePosition = adjustedGrossSinglePosition ? adjustedGrossSinglePosition : 0;
        this.netSinglePosition = netSinglePosition ? netSinglePosition : 0;
        this.netAllPositions = netAllPositions ? netAllPositions : 0;
    }
}