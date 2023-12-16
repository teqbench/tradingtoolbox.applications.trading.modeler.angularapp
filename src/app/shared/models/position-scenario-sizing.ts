/**
 * Rendered position scenario sizing
 *
 * @export
 * @class PositionScenarioSizing
 */
export class PositionScenarioSizing {
    private static readonly DEFAULT_LOT_COUNT = 1;

    // Number of shares in a single position
    private _numberOfSharesInPosition: number = 0;

    // Number of lots for a single position
    private _numberOfLotsPerPosition: number = PositionScenarioSizing.DEFAULT_LOT_COUNT;

    // The average size of a single lot
    private _averageLotSize: number = 0;

    /**
     * Creates an instance of PositionScenarioSizing.
     * @param {number} [value] The dollar value of the 'sized' single position scenario
     * @param {number} [numberOfSharesInPosition] Number of shares in a single position
     * @param {number} [numberOfLotsPerPosition] Number of lots for a single position
     * @memberof PositionScenarioSizing
     */
    constructor(value?: number, numberOfSharesInPosition?: number, numberOfLotsPerPosition?: number) {
        this.value = value ? value : 0;
        this.numberOfSharesInPosition = numberOfSharesInPosition ? numberOfSharesInPosition : 0;
        this.numberOfLotsPerPosition = numberOfLotsPerPosition ? numberOfLotsPerPosition : PositionScenarioSizing.DEFAULT_LOT_COUNT;
    }

    value: number;

    /**
     * Gets the number of shares in a single position
     *
     * @memberof PositionScenarioSizing
     */
    public get numberOfSharesInPosition() {
        return this._numberOfSharesInPosition;
    }

    /**
     * Sets the number of shares in a single position and updates the average lot size
     *
     * @memberof PositionScenarioSizing
     */
    public set numberOfSharesInPosition(value: number) {
        this._numberOfSharesInPosition = value;
        this.updateAverageLotSize();
    }

    /**
     * Gets the number of lots per position
     *
     * @memberof PositionScenarioSizing
     */
    public get numberOfLotsPerPosition() {
        return this._numberOfLotsPerPosition;
    }

    /**
     * Sets the number of lots for a single position and updates the average lot size
     *
     * @memberof PositionScenarioSizing
     */
    public set numberOfLotsPerPosition(value: number) {
        // have to have at least 1 lot
        this._numberOfLotsPerPosition = (value > 0) ? value : PositionScenarioSizing.DEFAULT_LOT_COUNT;
        this.updateAverageLotSize();
    }

    /**
     * Gets the average lot size
     *
     * @readonly
     * @memberof PositionScenarioSizing
     */
    public get averageLotSize() {
        return this._averageLotSize;
    }

    /**
     * Calculate the average lot size
     *
     * @private
     * @memberof PositionScenarioSizing
     */
    private updateAverageLotSize() {
        this._averageLotSize = this.numberOfSharesInPosition / this.numberOfLotsPerPosition;
    }
}