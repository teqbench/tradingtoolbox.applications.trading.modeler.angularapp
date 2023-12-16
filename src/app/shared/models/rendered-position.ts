import { PositionInput } from "./position-input";
import { PositionScenario } from './position-scenario';

/**
 * An instance of a fully rendered position.
 *
 * @export
 * @class RenderedPosition
 */
export class RenderedPosition {
    private _scenarios: PositionScenario[] = [];

    /**
     * Creates an instance of RenderedPosition.
     * 
     * @param {number} [id] The ID of the postion.
     * @param {PositionInput} [instance] The position's input values used to render a position's model.
     * @memberof RenderedPosition
     */
    constructor(id?: number, instance?: PositionInput) {
        this.id = id ? id : 0;
        this.input = instance ? instance : new PositionInput();
    }

    /**
     * The unique id; likly to be assigned from MongoDB
     *
     * @type {number}
     * @memberof RenderedPosition
     */
    id: number;

    /**
     * The position input values used to render a position's model.
     *
     * @type {PositionInput}
     * @memberof RenderedPosition
     */
    input: PositionInput;

    /**
     * The position's rendered scenarios.
     *
     * @readonly
     * @memberof RenderedPosition
     */
    public get scenarios() {
        return this._scenarios;
    }
}