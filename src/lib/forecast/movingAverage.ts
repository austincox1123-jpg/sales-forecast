import { ForecastParams, ForecastResult, TimeSeriesPoint } from './types';
import { advanceMonths } from './dateUtils';

function getWeights(window: number, profile: string, customWeights?: number[]): number[] {
  if (profile === 'custom' && customWeights && customWeights.length === window) {
    const sum = customWeights.reduce((a, b) => a + b, 0);
    return customWeights.map(w => w / sum);
  }
  if (profile === 'linear_decay') {
    // More recent months get higher weight (index 0 = oldest, index window-1 = most recent)
    const raw = Array.from({ length: window }, (_, i) => i + 1);
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map(w => w / sum);
  }
  // equal
  return Array(window).fill(1 / window);
}

export function weightedMovingAverage(
  actuals: TimeSeriesPoint[],
  params: ForecastParams,
  horizonMonths: number = 18
): ForecastResult[] {
  if (actuals.length === 0) return [];

  const sorted = [...actuals].sort((a, b) => a.month.localeCompare(b.month));
  const window = Math.min(params.window, sorted.length);
  const weights = getWeights(window, params.weightProfile || 'equal', params.weights);

  // Calculate seasonal indices if enabled
  let seasonalIndices: number[] | null = null;
  if (params.seasonalityEnabled && sorted.length >= 12) {
    seasonalIndices = calculateSeasonalIndices(sorted);
  }

  const results: ForecastResult[] = [];
  const values = sorted.map(p => p.value);

  // Use the last `window` actual values to start
  let recentValues = values.slice(-window);

  const lastMonth = sorted[sorted.length - 1].month;

  for (let i = 1; i <= horizonMonths; i++) {
    let forecast = 0;
    for (let j = 0; j < window; j++) {
      forecast += recentValues[recentValues.length - window + j] * weights[j];
    }

    const forecastMonth = advanceMonths(lastMonth, i);

    // Apply seasonal adjustment
    if (seasonalIndices) {
      const monthIndex = parseInt(forecastMonth.split('-')[1], 10) - 1;
      forecast *= seasonalIndices[monthIndex];
    }

    forecast = Math.round(forecast * 100) / 100;

    results.push({
      month: forecastMonth,
      statValue: forecast,
    });

    recentValues.push(forecast);
  }

  return results;
}

function calculateSeasonalIndices(data: TimeSeriesPoint[]): number[] {
  const monthTotals: number[] = new Array(12).fill(0);
  const monthCounts: number[] = new Array(12).fill(0);

  for (const point of data) {
    const monthIndex = parseInt(point.month.split('-')[1], 10) - 1;
    monthTotals[monthIndex] += point.value;
    monthCounts[monthIndex]++;
  }

  const overallAvg = data.reduce((sum, p) => sum + p.value, 0) / data.length;
  const indices: number[] = [];

  for (let i = 0; i < 12; i++) {
    if (monthCounts[i] > 0 && overallAvg > 0) {
      indices.push((monthTotals[i] / monthCounts[i]) / overallAvg);
    } else {
      indices.push(1);
    }
  }

  return indices;
}
