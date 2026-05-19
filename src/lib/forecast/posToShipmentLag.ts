import { ForecastResult, TimeSeriesPoint } from './types';
import { advanceMonths, toEndOfMonth } from './dateUtils';

export function posToShipmentLag(
  posData: TimeSeriesPoint[],
  shipmentData: TimeSeriesPoint[],
  lagPeriod: number = 2,
  lookbackWindow: number = 12,
  horizonMonths: number = 18
): ForecastResult[] {
  if (posData.length === 0 || shipmentData.length === 0) return [];

  const sortedPos = [...posData].sort((a, b) => a.month.localeCompare(b.month));
  const sortedShip = [...shipmentData].sort((a, b) => a.month.localeCompare(b.month));

  // Normalize all month keys to end-of-month for consistent lookups
  const shipMap = new Map(sortedShip.map(p => [toEndOfMonth(p.month), p.value]));
  const posNormalized = sortedPos.map(p => ({ ...p, month: toEndOfMonth(p.month) }));

  // Calculate shipment ratio = avg(shipment[t] / pos[t - lag]) over lookback window
  let ratioSum = 0;
  let ratioCount = 0;
  const recentPos = posNormalized.slice(-lookbackWindow - lagPeriod);

  for (let i = lagPeriod; i < recentPos.length; i++) {
    const posMonth = recentPos[i - lagPeriod].month;
    const posValue = recentPos[i - lagPeriod].value;

    // Find corresponding shipment month (lagPeriod months after POS)
    const shipMonth = advanceMonths(posMonth, lagPeriod);
    const shipValue = shipMap.get(shipMonth);

    if (posValue > 0 && shipValue !== undefined) {
      ratioSum += shipValue / posValue;
      ratioCount++;
    }
  }

  const shipmentRatio = ratioCount > 0 ? ratioSum / ratioCount : 1;

  // Project forward: use most recent POS values shifted by lag
  const results: ForecastResult[] = [];
  const lastMonth = posNormalized[posNormalized.length - 1].month;
  const posMap = new Map(posNormalized.map(p => [p.month, p.value]));

  for (let i = 1; i <= horizonMonths; i++) {
    const forecastMonth = advanceMonths(lastMonth, i);

    // For the forecast, use the POS value from `lagPeriod` months before
    const posSourceMonth = advanceMonths(forecastMonth, -lagPeriod);
    const posValue = posMap.get(posSourceMonth) ?? posNormalized[posNormalized.length - 1].value;

    results.push({
      month: forecastMonth,
      statValue: Math.round(posValue * shipmentRatio * 100) / 100,
    });
  }

  return results;
}
