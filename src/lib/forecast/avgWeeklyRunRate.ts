import { ForecastParams, ForecastResult, TimeSeriesPoint } from './types';
import { getMonthIndex, advanceMonths } from './dateUtils';

/**
 * Standard 4-4-5 fiscal calendar: fiscal weeks per calendar month.
 * Q1: Jan=4, Feb=4, Mar=5
 * Q2: Apr=4, May=4, Jun=5
 * Q3: Jul=4, Aug=4, Sep=5
 * Q4: Oct=4, Nov=4, Dec=5
 */
const FISCAL_WEEKS_PER_MONTH: Record<number, number> = {
  0: 4,  // Jan
  1: 4,  // Feb
  2: 5,  // Mar
  3: 4,  // Apr
  4: 4,  // May
  5: 5,  // Jun
  6: 4,  // Jul
  7: 4,  // Aug
  8: 5,  // Sep
  9: 4,  // Oct
  10: 4, // Nov
  11: 5, // Dec
};

export function getFiscalWeeks(monthIndex: number): number {
  return FISCAL_WEEKS_PER_MONTH[monthIndex] ?? 4;
}

export function avgWeeklyRunRate(
  actuals: TimeSeriesPoint[],
  params: ForecastParams,
  horizonMonths: number = 18
): ForecastResult[] {
  if (actuals.length === 0) return [];

  const sorted = [...actuals].sort((a, b) => a.month.localeCompare(b.month));
  const window = Math.min(params.window, sorted.length);
  const lookback = sorted.slice(-window);

  // Sum total cases and total fiscal weeks across the lookback window
  let totalCases = 0;
  let totalFiscalWeeks = 0;

  for (const point of lookback) {
    const monthIdx = getMonthIndex(point.month);
    const fiscalWeeks = getFiscalWeeks(monthIdx);
    totalCases += point.value;
    totalFiscalWeeks += fiscalWeeks;
  }

  // Average weekly run rate = total cases / total fiscal weeks
  const weeklyRunRate = totalFiscalWeeks > 0 ? totalCases / totalFiscalWeeks : 0;

  const results: ForecastResult[] = [];
  const lastMonth = sorted[sorted.length - 1].month;

  for (let i = 1; i <= horizonMonths; i++) {
    const forecastMonth = advanceMonths(lastMonth, i);
    const monthIdx = getMonthIndex(forecastMonth);
    const fiscalWeeks = getFiscalWeeks(monthIdx);

    // Forecast = weekly run rate * fiscal weeks in the target month
    const forecast = Math.round(weeklyRunRate * fiscalWeeks * 100) / 100;

    results.push({
      month: forecastMonth,
      statValue: forecast,
    });
  }

  return results;
}
