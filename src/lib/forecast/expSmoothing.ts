import { ForecastParams, ForecastResult, TimeSeriesPoint } from './types';
import { advanceMonths } from './dateUtils';

export function exponentialSmoothing(
  actuals: TimeSeriesPoint[],
  params: ForecastParams,
  horizonMonths: number = 18
): ForecastResult[] {
  if (actuals.length === 0) return [];

  const sorted = [...actuals].sort((a, b) => a.month.localeCompare(b.month));
  const alpha = params.alpha ?? 0.3;

  // Initialize with first value
  let smoothed = sorted[0].value;

  // Apply exponential smoothing to all actuals
  for (let i = 1; i < sorted.length; i++) {
    smoothed = alpha * sorted[i].value + (1 - alpha) * smoothed;
  }

  const results: ForecastResult[] = [];
  const lastMonth = sorted[sorted.length - 1].month;

  // Project forward - smoothed value is the level estimate
  for (let i = 1; i <= horizonMonths; i++) {
    results.push({
      month: advanceMonths(lastMonth, i),
      statValue: Math.round(smoothed * 100) / 100,
    });
  }

  return results;
}
