/**
 * Timezone-safe date utilities for forecast methods.
 * All month strings are in YYYY-MM-DD format.
 * We parse manually to avoid timezone issues with new Date(string).
 */

/** Parse a YYYY-MM-DD string into { year, month (0-based), day } without timezone issues */
export function parseMonth(monthStr: string): { year: number; month: number; day: number } {
  const parts = monthStr.split('-');
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10) - 1, // 0-based
    day: parseInt(parts[2], 10),
  };
}

/** Get the 0-based month index from a YYYY-MM-DD string */
export function getMonthIndex(monthStr: string): number {
  return parseInt(monthStr.split('-')[1], 10) - 1;
}

/** Advance a YYYY-MM-DD date by `n` months and return end-of-month as YYYY-MM-DD */
export function advanceMonths(monthStr: string, n: number): string {
  const { year, month } = parseMonth(monthStr);
  const totalMonths = year * 12 + month + n;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = totalMonths % 12; // 0-based

  // End of month: day 0 of next month = last day of target month
  const endOfMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0));
  const y = endOfMonth.getUTCFullYear();
  const m = String(endOfMonth.getUTCMonth() + 1).padStart(2, '0');
  const d = String(endOfMonth.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Normalize any YYYY-MM-DD to its end-of-month equivalent */
export function toEndOfMonth(monthStr: string): string {
  const { year, month } = parseMonth(monthStr);
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const y = endOfMonth.getUTCFullYear();
  const m = String(endOfMonth.getUTCMonth() + 1).padStart(2, '0');
  const d = String(endOfMonth.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
