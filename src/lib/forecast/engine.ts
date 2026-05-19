import { ActualData, DataSource, ForecastParams, ForecastResult, TimeSeriesPoint } from './types';
import { avgWeeklyRunRate } from './avgWeeklyRunRate';
import { weightedMovingAverage } from './movingAverage';
import { exponentialSmoothing } from './expSmoothing';
import { posToShipmentLag } from './posToShipmentLag';
import { linearTrend } from './linearTrend';

function extractTimeSeries(
  actuals: ActualData[],
  source: DataSource,
  blendWeights?: { pos: number; invoice: number; order: number },
  excludeMonths?: string[]
): TimeSeriesPoint[] {
  return actuals
    .filter(a => !excludeMonths?.includes(a.month))
    .map(a => {
      let rawValue: number | null;
      switch (source) {
        case 'pos':
          rawValue = a.posCases;
          break;
        case 'invoice':
          rawValue = a.invoiceCases;
          break;
        case 'order':
          rawValue = a.orderCases;
          break;
        case 'blended': {
          const w = blendWeights ?? { pos: 0.33, invoice: 0.34, order: 0.33 };
          // Blended is null only if all components are null
          if (a.posCases === null && a.invoiceCases === null && a.orderCases === null) {
            rawValue = null;
          } else {
            rawValue =
              (a.posCases ?? 0) * w.pos +
              (a.invoiceCases ?? 0) * w.invoice +
              (a.orderCases ?? 0) * w.order;
          }
          break;
        }
      }
      return { month: a.month, value: rawValue };
    })
    // Only exclude months where data is truly absent (null), not legitimate zeros
    .filter((p): p is { month: string; value: number } => p.value !== null)
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function runForecast(
  actuals: ActualData[],
  params: ForecastParams,
  horizonMonths: number = 18
): ForecastResult[] {
  const series = extractTimeSeries(actuals, params.source, params.blendWeights, params.excludeMonths);

  switch (params.method) {
    case 'avg_weekly_run_rate':
      return avgWeeklyRunRate(series, params, horizonMonths);

    case 'weighted_ma':
      return weightedMovingAverage(series, params, horizonMonths);

    case 'exp_smoothing':
      return exponentialSmoothing(series, params, horizonMonths);

    case 'pos_lag': {
      // POS-to-Shipment Lag always needs both POS and shipment data.
      // POS data is always sourced from the POS column.
      // Shipment data uses the selected source — but if source is POS,
      // we fall back to invoice since POS-to-POS lag is not meaningful.
      const posData = extractTimeSeries(actuals, 'pos', undefined, params.excludeMonths);
      const shipSource: DataSource = params.source === 'pos' ? 'invoice' : params.source;
      const shipData = extractTimeSeries(actuals, shipSource, undefined, params.excludeMonths);
      return posToShipmentLag(posData, shipData, params.lagPeriod ?? 2, params.window, horizonMonths);
    }

    case 'linear_trend':
      return linearTrend(series, params, horizonMonths);

    default:
      return weightedMovingAverage(series, params, horizonMonths);
  }
}

export function checkPosDataAvailability(actuals: ActualData[]): boolean {
  return actuals.some(a => a.posCases !== null && a.posCases > 0);
}
