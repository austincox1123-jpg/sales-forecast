import { ForecastParams, ForecastResult, TimeSeriesPoint } from './types';
import { advanceMonths } from './dateUtils';

/**
 * Linear trend (slope) forecast using ordinary least-squares regression.
 * Fits y = a + b*x to the lookback window and projects forward.
 */
export function linearTrend(
  actuals: TimeSeriesPoint[],
  params: ForecastParams,
  horizonMonths: number = 18
): ForecastResult[] {
  if (actuals.length === 0) return [];

  const sorted = [...actuals].sort((a, b) => a.month.localeCompare(b.month));
  const window = Math.min(params.window, sorted.length);
  const lookback = sorted.slice(-window);

  // Assign x = 0, 1, 2, ... for each lookback point
  const n = lookback.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = lookback[i].value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  // Least-squares slope (b) and intercept (a)
  const denominator = n * sumX2 - sumX * sumX;
  let slope: number;
  let intercept: number;

  if (denominator === 0) {
    // All x values the same (single point) — flat forecast
    slope = 0;
    intercept = sumY / n;
  } else {
    slope = (n * sumXY - sumX * sumY) / denominator;
    intercept = (sumY - slope * sumX) / n;
  }

  const results: ForecastResult[] = [];
  const lastMonth = sorted[sorted.length - 1].month;

  // The last lookback point is at x = n - 1, so forecast points start at x = n
  for (let i = 1; i <= horizonMonths; i++) {
    const x = n - 1 + i;
    let forecast = intercept + slope * x;

    // Floor at zero — negative forecasts don't make sense for cases
    forecast = Math.max(0, forecast);
    forecast = Math.round(forecast * 100) / 100;

    results.push({
      month: advanceMonths(lastMonth, i),
      statValue: forecast,
    });
  }

  return results;
}
