import { PositionScenarioFees } from "./position-scenario-fees";
import { PositionScenarioGains } from "./position-scenario-gains";
import { PositionScenarioSizing } from "./position-scenario-sizing";
import { PositionScenarioProfits } from "./position-scenario-profits";
import { PositionScenarioLot } from "./position-scenario-lot";

/**
 * Rendered position scenario 
 *
 * @export
 * @class PositionScenario
 */
export class PositionScenario {
    private _lots: PositionScenarioLot[] = [];

    /**
     * Creates an instance of PositionScenario.
     * @param {PositionScenarioSizing} [sizing] The position sizing for a rendered scenario
     * @param {PositionScenarioProfits} [profits] The profits for a rendered scenario
     * @param {PositionScenarioGains} [gains] The gains for a rendered scenario
     * @param {PositionScenarioFees} [fees] The fees for a rendered scenario
     * @param {PositionScenarioLot[]} [lots] The lots for a rendered scenario
     * @memberof PositionScenario
     */
    constructor(sizing?: PositionScenarioSizing, profits?: PositionScenarioProfits, gains?: PositionScenarioGains, fees?: PositionScenarioFees, lots?: PositionScenarioLot[]) {
        this.sizing = sizing ? sizing : new PositionScenarioSizing();
        this.profits = profits ? profits : new PositionScenarioProfits();
        this.gains = gains ? gains : new PositionScenarioGains();
        this.fees = fees ? fees : new PositionScenarioFees();

        if (lots) {
            this.lots.push(...lots);
        }
    }

    /**
     * Get/sets the position sizing for a rendered scenario
     *
     * @type {PositionScenarioSizing}
     * @memberof PositionScenario
     */
    sizing: PositionScenarioSizing;

    /**
     * Get/sets the profits for a rendered scenario
     *
     * @type {PositionScenarioProfits}
     * @memberof PositionScenario
     */
    profits: PositionScenarioProfits;

    /**
     * Gets/sets the gains for a rendered scenario
     *
     * @type {PositionScenarioGains}
     * @memberof PositionScenario
     */
    gains: PositionScenarioGains;

    /**
     * Get/sets the fees for a rendered scenario
     *
     * @type {PositionScenarioFees}
     * @memberof PositionScenario
     */
    fees: PositionScenarioFees;

    /**
     * Gets the list of lots for a rendered scenario
     *
     * @readonly
     * @memberof PositionScenario
     */
    public get lots() {
        return this._lots;
    }
}