import { Injectable } from '@angular/core';
import { PositionInput } from '../models/position-input';
import { RenderedPosition } from '../models/rendered-position';
import { PositionScenario } from '../models/position-scenario';
import { PositionScenarioSizing } from '../models/position-scenario-sizing';
import { PositionScenarioProfits } from '../models/position-scenario-profits';
import { PositionScenarioGains } from '../models/position-scenario-gains';
import { PositionScenarioFees } from '../models/position-scenario-fees';
import { PositionScenarioLot } from '../models/position-scenario-lot';

/**
 * Service managing the rendering of a position based on a position's input values.
 *
 * @export
 * @class PositionRedererService
 */
@Injectable({
  providedIn: 'root'
})
export class PositionRedererService {
  private static readonly NUMBER_OF_SCENARIOS_TO_GENERATE: number = 6;
  private static readonly AVERAGE_NUMBER_OF_TRADING_DAYS_PER_YEAR: number = 253;
  private static readonly AVERAGE_NUMBER_OF_TRADING_DAYS_PER_MONTH: number = PositionRedererService.AVERAGE_NUMBER_OF_TRADING_DAYS_PER_YEAR / 12;

  /**
  * Creates an instance of PositionRedererService.
  * @memberof PositionRedererService
  */
  constructor() { }

  /**
   * Render a position model based on the supplied position's inputs.
   *
   * @param {PositionInput} modelInput
   * @return {*}  {RenderedPosition} A rendered position model.
   * @memberof PositionRedererService
   */
  public renderModel(modelInput: PositionInput): RenderedPosition {
    let instance: RenderedPosition = new RenderedPosition();
    let currentPositionValue: number = modelInput.initialValue;
    let currentNumberOfSharesInPosition: number = modelInput.numberOfSharesInPosition;
    let currentAverageLotSize: number = currentNumberOfSharesInPosition / modelInput.averageNumberOfLotsPerPosition;
    let lotSharePriceIncrement: number = modelInput.pricePerShare * modelInput.averageGainPerLot;

    // Each "scenario" is basically modelling out a month so just do six for faster calculations and beyond that, numbers just get too unrealistic.
    for (let i = 1; i <= PositionRedererService.NUMBER_OF_SCENARIOS_TO_GENERATE; i++) {
      let grossSinglePosition: number = 0;

      // setup scenario position
      let position: PositionScenarioSizing = new PositionScenarioSizing(currentPositionValue, currentNumberOfSharesInPosition, modelInput.averageNumberOfLotsPerPosition);

      // Calculate gross profit for a position factoring in there may be more than one lot per position. At same time keep running list of 
      // the lot asking prices for display
      let profits: PositionScenarioProfits = new PositionScenarioProfits();
      let gains: PositionScenarioGains = new PositionScenarioGains();
      let fees: PositionScenarioFees = new PositionScenarioFees();
      let lots: PositionScenarioLot[] = [];

      // Start at 1 since we know there's always at least one lot per position.
      let initialLotValue: number = position.averageLotSize * modelInput.pricePerShare;

      for (let lotIndex = 1; lotIndex <= position.numberOfLotsPerPosition; lotIndex++) {
        let lot: PositionScenarioLot = new PositionScenarioLot(initialLotValue, position.averageLotSize, modelInput.pricePerShare + (lotIndex * lotSharePriceIncrement));
        lots.push(lot);
        grossSinglePosition += (lot.grossProfit);
      }

      // Init scenario position
      profits.grossSinglePosition = grossSinglePosition;

      // The gross is adjusted based on the estimated success rate of asks/sales. This is done because impossible to be 100% so, in an 
      // attempt to make more realistic model scenarios, have the ability to adjust the estimated success rate which impacts the total gains.
      // No losses are factored in at this time as not sure how would do that.
      profits.adjustedGrossSinglePosition = grossSinglePosition * modelInput.estimatedSuccessRate;

      // The net for a single position is the gross for a single position less taxes and fees (note: fees are 1 for buying in and n for the number of lots for the position)
      profits.netSinglePosition = (profits.adjustedGrossSinglePosition * (1 - modelInput.effectiveTaxRate)) - (modelInput.estimatedFeePerTransaction + (modelInput.estimatedFeePerTransaction * modelInput.averageNumberOfLotsPerPosition));
      profits.netAllPositions = profits.netSinglePosition * modelInput.averageNumberOfPositionsPerDay;

      // Calculate gains
      gains.gainsDaily = profits.netAllPositions;
      gains.gainsWeekly = gains.gainsDaily * modelInput.averageNumberOfTradingDaysPerWeek;

      // If trading "5" days per week, assume trading the traditional markets which are closed weekends etc. and in effect average 253 per year and 21.083333333333333 per month (i.e. 253 / 12)
      if (modelInput.averageNumberOfTradingDaysPerWeek == 5) {
        gains.gainsMonthly = gains.gainsDaily * PositionRedererService.AVERAGE_NUMBER_OF_TRADING_DAYS_PER_MONTH;
        gains.gainsYearly = gains.gainsDaily * PositionRedererService.AVERAGE_NUMBER_OF_TRADING_DAYS_PER_YEAR;
      } else {
        gains.gainsMonthly = gains.gainsDaily * (4 * modelInput.averageNumberOfTradingDaysPerWeek);
        gains.gainsYearly = gains.gainsDaily * (12 * 4 * modelInput.averageNumberOfTradingDaysPerWeek);
      }

      // Substract monthly expenses from gains
      gains.gainsMonthly = gains.gainsMonthly - modelInput.expenses;
      gains.gainsYearly = gains.gainsYearly - (12 * modelInput.expenses);

      // Calculate fees
      fees.feesSinglePositionDaily = (1 + modelInput.averageNumberOfLotsPerPosition) * modelInput.estimatedFeePerTransaction;
      fees.feesAllPositionsDaily = fees.feesSinglePositionDaily * modelInput.averageNumberOfPositionsPerDay;
      fees.feesWeekly = fees.feesAllPositionsDaily * modelInput.averageNumberOfTradingDaysPerWeek

      // If trading "5" days per week, assume trading the traditional markets which are closed weekends etc. and in effect average 253 per year and 21.083333333333333 per month (i.e. 253 / 12)
      if (modelInput.averageNumberOfTradingDaysPerWeek == 5) {
        fees.feesMonthly = fees.feesAllPositionsDaily * PositionRedererService.AVERAGE_NUMBER_OF_TRADING_DAYS_PER_MONTH;
        fees.feesYearly = fees.feesAllPositionsDaily * PositionRedererService.AVERAGE_NUMBER_OF_TRADING_DAYS_PER_YEAR
      } else {
        fees.feesMonthly = fees.feesAllPositionsDaily * (4 * modelInput.averageNumberOfTradingDaysPerWeek);
        fees.feesYearly = fees.feesAllPositionsDaily * (12 * 4 * modelInput.averageNumberOfTradingDaysPerWeek);
      }

      let scenario: PositionScenario = new PositionScenario(position, profits, gains, fees, lots);
      instance.scenarios.push(scenario)

      // Setup next position to render
      currentPositionValue += gains.gainsMonthly;
      currentNumberOfSharesInPosition = currentPositionValue / modelInput.pricePerShare;
      currentAverageLotSize = currentNumberOfSharesInPosition / modelInput.averageNumberOfLotsPerPosition;
    }

    return instance;
  }
}
