/**
 * Rendered position scenario lots
 *
 * @export
 * @class PositionScenarioLot
 */
export class PositionScenarioLot {
    private _value: number = 0;
    private _shareCount: number = 0;
    private _sellPrice: number = 0;
    private _grossProfit: number = 0;

    /**
     * Creates an instance of PositionScenarioLot.
     * @param {number} initialValue The position's intial value.
     * @param {number} shareCount The number of shares in the position.
     * @param {number} sellPrice The target sale price of the lot.
     * @memberof PositionScenarioLot
     */
    constructor(public initialValue: number, shareCount: number, sellPrice: number) {
        this.shareCount = shareCount;
        this.sellPrice = sellPrice;
    }

    /**
     * Gets the share count for the lot
     *
     * @memberof PositionScenarioLot
     */
    public get shareCount() {
        return this._shareCount;
    }

    /**
     * Setw the share count for the lot and updates the lot value.
     *
     * @memberof PositionScenarioLot
     */
    public set shareCount(count: number) {
        this._shareCount = count;
        this.updateValue();
    }

    /**
     * Gets the target sale price of the lot.
     *
     * @memberof PositionScenarioLot
     */
    public get sellPrice() {
        return this._sellPrice;
    }

    /**
     * Sets the target sale price of the lot and updates the lot value.
     *
     * @memberof PositionScenarioLot
     */
    public set sellPrice(price: number) {
        this._sellPrice = price;
        this.updateValue();
    }

    /**
     * Gets the dollar value of the lot
     *
     * @readonly
     * @memberof PositionScenarioLot
     */
    public get value() {
        return this._value;
    }

    /**
     * Updates the dollar value of the lot and updates the gross profit for the lot.
     *
     * @private
     * @memberof PositionScenarioLot
     */
    private updateValue() {
        this._value = this.shareCount * this.sellPrice;

        this.updateGrossProfit();
    }

    /**
     * Gets the gross profit of the lot
     *
     * @readonly
     * @memberof PositionScenarioLot
     */
    public get grossProfit() {
        return this._grossProfit;
    }

    /**
     * Updates the gross profit of the lot
     *
     * @private
     * @memberof PositionScenarioLot
     */
    private updateGrossProfit() {
        this._grossProfit = this.value - this.initialValue;
    }
}