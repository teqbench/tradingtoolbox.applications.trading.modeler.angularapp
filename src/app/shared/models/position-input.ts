/**
 * Interface defining the fields for the input values for a single position.
 *
 * @export
 * @interface IPositionInput
 */
export interface IPositionInput {
    // The unique ID of the position; set by DB when new document created.
    id: string;

    // The name of the postion.
    name: string;

    // The intial value of the position.
    initialValue: number;

    // The price per share
    pricePerShare: number;

    // The average number of positions per day to model
    averageNumberOfPositionsPerDay: number;

    // The average number of lots per position to model
    averageNumberOfLotsPerPosition: number;

    // The average number of trading days per week
    averageNumberOfTradingDaysPerWeek: number;    
    
    // The estimated success rate (specifically, the success rate of being able to set at target lot prices)
    estimatedSuccessRate: number;

    // The overall target gain window
    targetGain: number;

    // The federal tax rate to apply when calculating the effective tax rate, to factor into a rendered position's 'costs' (fees, taxes and expenses).
    federalTaxRate: number;

    // The state tax rate to apply when calculating the effective tax rate, to factor into a rendered position's 'costs' (fees, taxes and expenses).
    stateTaxRate: number;

    // Any additionaly expenses, typicall what would be monthly household budgeted expeneses, to factor into a rendered position's 'costs' (fees, taxes and expenses).
    expenses: number;

    // The estimated fee per transaction, to factor into a rendered position's 'costs' (fees, taxes and expenses).
    estimatedFeePerTransaction: number;

    // The sort display position
    listPosition: number;
}

/**
 * The position input domain model with caculate fields which are updated as related fields/property values are changed.
 *
 * @export
 * @class PositionInput
 * @implements {IPositionInput}
 */
export class PositionInput implements IPositionInput {
    private static readonly DEFAULT_FEDERAL_TAX_RATE = 0.37;
    private static readonly DEFAULT_STATE_TAX_RATE = 0.069;
    private static readonly DEFAULT_INITIAL_POSITION_VALUE = 0.0;
    private static readonly DEFAULT_PRICE_PER_SHARE = 0.0;
    private static readonly DEFAULT_TARGET_GAIN = 0.10;
    private static readonly DEFAULT_AVERAGE_NUMBER_OF_POSITIONS_PER_DAY = 1;
    private static readonly DEFAULT_AVERAGE_NUMBER_OF_LOTS_PER_POSITION = 1;
    public static readonly DEFAULT_AVERAGE_NUMBER_OF_TRADING_DAYS_PER_WEEK = 5;
    private static readonly DEFAULT_EXPENSES = 0.0;
    private static readonly DEFAULT_ESTIMATED_FEE_PER_TRANSACTION = 10.0;
    private static readonly DEFAULT_ESTIMATED_SUCCESS_RATE = 0.75;
    public static readonly MAX_HUMAN_TRADES_PER_DAY = 15;
    public static readonly DEFAULT_LIST_POSITION = -1;

    private _initialPositionValue: number = PositionInput.DEFAULT_INITIAL_POSITION_VALUE;
    private _pricePerShare: number = PositionInput.DEFAULT_PRICE_PER_SHARE;
    private _numberOfSharesInPosition: number = 0;
    private _averageNumberOfSharesPerLot: number = 0;
    private _averageNumberOfLotsPerPosition: number = PositionInput.DEFAULT_AVERAGE_NUMBER_OF_LOTS_PER_POSITION;
    private _averageNumberOfTradingDaysPerWeek: number = PositionInput.DEFAULT_AVERAGE_NUMBER_OF_TRADING_DAYS_PER_WEEK;
    private _averageGainPerLot: number = 0;
    private _targetGain: number= PositionInput.DEFAULT_TARGET_GAIN;
    private _averageLotSize: number = 0;

    private _federalTaxRate: number = 0;
    private _stateTaxRate: number = 0;
    private _effectiveTaxRate: number = 0; 
    private _totalNumberOfAsks: number = 0;                         // total number of asks for a model = # of positions * # of lots per position
    private _adjustedNumbersOfAsks: number = 0;                     // this is the adjustment made based on the estimated success rate
    private _isBotCandidate: boolean = false;
    private _botCandidateMessage: string = "";

    // in effect a 'guesstimate' of % of how many successful trades there are for all positions
    private _estimatedSuccessRate: number = PositionInput.DEFAULT_ESTIMATED_SUCCESS_RATE;
    
    // 1 or more; default 1
    private _averageNumberOfPositionsPerDay: number = PositionInput.DEFAULT_AVERAGE_NUMBER_OF_POSITIONS_PER_DAY;

    constructor(dto?: IPositionInput) {
        if (dto) {
            this.id = dto.id;
            this.name = dto.name;

            this.initialValue = dto.initialValue;
            this.pricePerShare = dto.pricePerShare;

            this.averageNumberOfPositionsPerDay = dto.averageNumberOfPositionsPerDay;
            this.averageNumberOfLotsPerPosition = dto.averageNumberOfLotsPerPosition;
            this.averageNumberOfTradingDaysPerWeek = dto.averageNumberOfTradingDaysPerWeek;
            this.estimatedSuccessRate = dto.estimatedSuccessRate;

            this.targetGain = dto.targetGain;

            this.federalTaxRate = dto.federalTaxRate;
            this.stateTaxRate = dto.stateTaxRate;

            this.expenses = dto.expenses;
            this.estimatedFeePerTransaction = dto.estimatedFeePerTransaction;

            this.listPosition = dto.listPosition;
        } else {
            this.id = "";
            this.name = "";

            this.averageNumberOfPositionsPerDay = PositionInput.DEFAULT_AVERAGE_NUMBER_OF_POSITIONS_PER_DAY;
            this.averageNumberOfLotsPerPosition = PositionInput.DEFAULT_AVERAGE_NUMBER_OF_LOTS_PER_POSITION;
            this.estimatedSuccessRate = PositionInput.DEFAULT_ESTIMATED_SUCCESS_RATE;            

            this.initialValue = PositionInput.DEFAULT_INITIAL_POSITION_VALUE;
            this.pricePerShare = PositionInput.DEFAULT_PRICE_PER_SHARE;

            this.averageNumberOfTradingDaysPerWeek = PositionInput.DEFAULT_AVERAGE_NUMBER_OF_TRADING_DAYS_PER_WEEK;

            this.targetGain = PositionInput.DEFAULT_TARGET_GAIN;

            this.federalTaxRate = PositionInput.DEFAULT_FEDERAL_TAX_RATE;
            this.stateTaxRate = PositionInput.DEFAULT_STATE_TAX_RATE;

            this.expenses = PositionInput.DEFAULT_EXPENSES;
            this.estimatedFeePerTransaction = PositionInput.DEFAULT_ESTIMATED_FEE_PER_TRANSACTION;
            this.listPosition = PositionInput.DEFAULT_LIST_POSITION;
        }
    }

    // unique id; likly to be assigned from MongoDB
    id: string;

    // short name description of model. also acts as key if have a list of positions as each position modeled must be unique.
    name: string;

    listPosition: number;

    // number of days / week can trade; crypto max is 7 min is 1, traditional securities max is 5 min is 1.
    public get averageNumberOfTradingDaysPerWeek() {
        return this._averageNumberOfTradingDaysPerWeek;
    }

    public set averageNumberOfTradingDaysPerWeek(value: number) {
        this._averageNumberOfTradingDaysPerWeek = value;
        this.updateBotCandidateStatus();
    }

    // total montly, budgeted expenses to deduct from profits
    expenses: number;

    // exchange fee to buy or sell
    estimatedFeePerTransaction: number;

    public get averageLotSize() {
        return this._averageLotSize;
    }

    private updateAverageLotSize() {
        this._averageLotSize = this.numberOfSharesInPosition / this.averageNumberOfLotsPerPosition;
    }

    public get averageNumberOfPositionsPerDay() {
        return this._averageNumberOfPositionsPerDay;
    }

    public set averageNumberOfPositionsPerDay(value: number) {
        this._averageNumberOfPositionsPerDay = value;
        this.updateTotalNumberOfAsks();
    }

    public get estimatedSuccessRate() {
        return this._estimatedSuccessRate;
    }

    public set estimatedSuccessRate(value: number) {
        this._estimatedSuccessRate = value;
        this.updateAdjustedNumbersOfAsks();
    }

    public get totalNumberOfAsks() {
        return this._totalNumberOfAsks;
    } 

    private updateTotalNumberOfAsks() {
        this._totalNumberOfAsks = this.averageNumberOfPositionsPerDay * this.averageNumberOfLotsPerPosition;
        this.updateAdjustedNumbersOfAsks();
        this.updateBotCandidateStatus();
    }

    public get adjustedNumbersOfAsks() {
        return this._adjustedNumbersOfAsks;
    }     

    private updateAdjustedNumbersOfAsks() {
        this._adjustedNumbersOfAsks = this.totalNumberOfAsks * this.estimatedSuccessRate;
    }

    public get isBotCandidate() {
        return this._isBotCandidate;
    }

    public get botCandidateMessage() {
        return this._botCandidateMessage;
    }

    public get MaxHumanTradesPerDay() {
        // Have to use a getter in order to access static member from template.
        return PositionInput.MAX_HUMAN_TRADES_PER_DAY;
    }

    private updateBotCandidateStatus() {
        let message: string = "";
        let message1: string = "";
        let message2: string = "";
        if (this.totalNumberOfAsks > PositionInput.MAX_HUMAN_TRADES_PER_DAY) {
            message1 = "'Total # Asks All Positions / Day' (" + this.totalNumberOfAsks + " > ~max human trades / day " + PositionInput.MAX_HUMAN_TRADES_PER_DAY + ")"; 
        }
    
        if (this.averageNumberOfTradingDaysPerWeek > PositionInput.DEFAULT_AVERAGE_NUMBER_OF_TRADING_DAYS_PER_WEEK) {
            message2 = "'Average # Trading Days / Week' (" + this.averageNumberOfTradingDaysPerWeek + ")"; 
        }
    
        if (message1 && message2) {
            message = message1 + " and " + message2;
        } else if (message1) {
            message = message1;
        } else {
            message = message2;
        }
    
        if (message) {
            this._isBotCandidate = true;
            this._botCandidateMessage = "Candidate for trading bot; see " + message + " for this model.";
        } else {
            this._isBotCandidate = false;
            this._botCandidateMessage = "";
        }          
    }

    public get federalTaxRate() {
        return this._federalTaxRate;
    } 

    public set federalTaxRate(rate: number) {
        this._federalTaxRate = rate;
        this.updateEffectiveTaxRate();
    }

    public get stateTaxRate() {
        return this._stateTaxRate;
    } 

    public set stateTaxRate(rate: number) {
        this._stateTaxRate = rate;
        this.updateEffectiveTaxRate();
    }

    public get effectiveTaxRate() {
        return this._effectiveTaxRate;
    } 

    private updateEffectiveTaxRate() {
        this._effectiveTaxRate = this.federalTaxRate + this.stateTaxRate;
    }

    public get initialValue() {
        return this._initialPositionValue;
    }

    public set initialValue(value: number) {
        this._initialPositionValue = value;
        this.updateSizeOfPosition();
        this.updateAverageLotSize();
    }

    public get pricePerShare() {
        return this._pricePerShare;
    }

    public set pricePerShare(value: number) {
        this._pricePerShare = value;
        this.updateSizeOfPosition();
        this.updateAverageLotSize();
    }

    public get numberOfSharesInPosition() {
        return this._numberOfSharesInPosition;
    }

    // apparently in TS cannot have different access modifiers for a property, so use a private function instead to set the value since only want
    // this value calculated.
    private updateSizeOfPosition() {
        this._numberOfSharesInPosition = (this.pricePerShare > 0) ? this.initialValue / this.pricePerShare : 0;
        this.updateAverageNumberOfSharesPerLot();
    }

    private updateAverageNumberOfSharesPerLot() {
        this._averageNumberOfSharesPerLot = this.numberOfSharesInPosition / this.averageNumberOfLotsPerPosition;
    }

    public get averageNumberOfSharesPerLot() {
        return this._averageNumberOfSharesPerLot;
    }

    // target % increase if have a single lot/position.
    public get targetGain() {
        return this._targetGain;
    }

    public set targetGain(value: number) {
        this._targetGain = value;
        this.updateAverageGainPerLot();
    }

    // 1 or more; default 1
    public get averageNumberOfLotsPerPosition() {
        return this._averageNumberOfLotsPerPosition;
    }

    public set averageNumberOfLotsPerPosition(value: number) {
        this._averageNumberOfLotsPerPosition = (value > 0) ? value : PositionInput.DEFAULT_AVERAGE_NUMBER_OF_LOTS_PER_POSITION;
        this.updateAverageGainPerLot();
        this.updateTotalNumberOfAsks();
        this.updateAverageLotSize();
        this.updateAverageNumberOfSharesPerLot();
    }
    
    // % increase per lot if have more than one lot
    public get averageGainPerLot() {
        return this._averageGainPerLot;
    }

    // apparently in TS cannot have different access modifiers for a property, so use a private function instead to set the value since only want
    // this value calculated.
    private updateAverageGainPerLot() {
        // averageNumberOfLotsPerPosition will never be 0, so just go ahead w/ the operation
        this._averageGainPerLot = this.targetGain / this.averageNumberOfLotsPerPosition;
    }
}