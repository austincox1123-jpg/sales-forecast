export type DataSource = 'pos' | 'invoice' | 'order' | 'blended';
export type ForecastMethod = 'avg_weekly_run_rate' | 'weighted_ma' | 'exp_smoothing' | 'pos_lag' | 'linear_trend';
export type WeightProfile = 'equal' | 'linear_decay' | 'custom';

export interface ForecastParams {
  method: ForecastMethod;
  source: DataSource;
  window: number; // lookback months (3-24)
  weights?: number[]; // custom weights
  weightProfile?: WeightProfile;
  alpha?: number; // exp smoothing (0.1-0.9)
  lagPeriod?: number; // pos lag (1-3 months)
  blendWeights?: { pos: number; invoice: number; order: number }; // for blended source
  excludeMonths?: string[]; // ISO date strings to exclude
  seasonalityEnabled?: boolean;
}

export interface TimeSeriesPoint {
  month: string; // ISO date string
  value: number;
}

export interface ForecastResult {
  month: string;
  statValue: number;
}

export interface ActualData {
  month: string;
  posCases: number | null;
  invoiceCases: number | null;
  orderCases: number | null;
}
