import { IPositionInput } from "../position-input";

/**
 * Position input DTO used to tansport position input values in a light-weight structure.
 *
 * @export
 * @class PositionInputDto
 * @implements {IPositionInput}
 */
export class PositionInputDto implements IPositionInput {
    constructor(instance?: IPositionInput) {
        if (instance) {
            this.id = instance.id;
            this.name = instance.name;
            this.initialValue = instance.initialValue;
            this.pricePerShare = instance.pricePerShare;

            this.averageNumberOfPositionsPerDay = instance.averageNumberOfPositionsPerDay;
            this.averageNumberOfLotsPerPosition = instance.averageNumberOfLotsPerPosition;
            this.averageNumberOfTradingDaysPerWeek = instance.averageNumberOfTradingDaysPerWeek;
            this.estimatedSuccessRate = instance.estimatedSuccessRate;

            this.targetGain = instance.targetGain;

            this.federalTaxRate = instance.federalTaxRate;
            this.stateTaxRate = instance.stateTaxRate;

            this.expenses = instance.expenses;
            this.estimatedFeePerTransaction = instance.estimatedFeePerTransaction;

            this.listPosition = instance.listPosition;
        }
    }

    id: string = "";
    name: string = "";
    initialValue: number = 0;
    pricePerShare: number = 0;

    averageNumberOfPositionsPerDay: number = 0;
    averageNumberOfLotsPerPosition: number = 0;
    averageNumberOfTradingDaysPerWeek: number = 0;
    estimatedSuccessRate: number = 0;

    targetGain: number = 0;

    federalTaxRate: number = 0;
    stateTaxRate: number = 0;

    expenses: number = 0;
    estimatedFeePerTransaction: number = 0;

    listPosition: number = 0;
}