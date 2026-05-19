'use client';

import { useAppStore } from '@/lib/store';
import { ForecastMethod, DataSource, WeightProfile } from '@/lib/forecast/types';

interface ForecastConfigProps {
  onRecalculate: () => void;
}

const HORIZON_OPTIONS = [3, 6, 9, 12, 15, 18, 24, 30, 36];

export function ForecastConfig({ onRecalculate }: ForecastConfigProps) {
  const {
    forecastParams,
    setForecastParams,
    hasPosData,
    horizonMonths,
    setHorizonMonths,
  } = useAppStore();

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Forecast Configuration</h2>

      {/* Forecast Horizon */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Forecast Horizon</label>
        <select
          value={horizonMonths}
          onChange={(e) => setHorizonMonths(parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
        >
          {HORIZON_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m} months
            </option>
          ))}
        </select>
      </div>

      {/* Method */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Method</label>
        <select
          value={forecastParams.method}
          onChange={(e) => setForecastParams({ method: e.target.value as ForecastMethod })}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
        >
          <option value="avg_weekly_run_rate">Avg Weekly Run Rate (Fiscal Weeks)</option>
          <option value="weighted_ma">Weighted Moving Average</option>
          <option value="exp_smoothing">Exponential Smoothing</option>
          <option value="pos_lag" disabled={!hasPosData}>
            POS-to-Shipment Lag {!hasPosData ? '(requires POS data)' : ''}
          </option>
          <option value="linear_trend">Linear Trend (Slope)</option>
        </select>
      </div>

      {/* Data Source */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Data Source</label>
        <select
          value={forecastParams.source}
          onChange={(e) => setForecastParams({ source: e.target.value as DataSource })}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
        >
          <option value="pos" disabled={!hasPosData}>
            POS Cases {!hasPosData ? '(no data)' : ''}
          </option>
          <option value="invoice">Invoice Cases</option>
          <option value="order">Order Cases</option>
          <option value="blended">Blended</option>
        </select>
      </div>

      {/* Lookback Window */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Lookback Window: {forecastParams.window} months
        </label>
        <input
          type="range"
          min={3}
          max={24}
          value={forecastParams.window}
          onChange={(e) => setForecastParams({ window: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>3</span>
          <span>24</span>
        </div>
      </div>

      {/* Weight profile (for MA) */}
      {forecastParams.method === 'weighted_ma' && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Weight Profile</label>
          <select
            value={forecastParams.weightProfile ?? 'equal'}
            onChange={(e) =>
              setForecastParams({ weightProfile: e.target.value as WeightProfile })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="equal">Equal</option>
            <option value="linear_decay">Linear Decay (recent = higher)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      )}

      {/* Alpha (for exp smoothing) */}
      {forecastParams.method === 'exp_smoothing' && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Alpha: {(forecastParams.alpha ?? 0.3).toFixed(1)}
          </label>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.1}
            value={forecastParams.alpha ?? 0.3}
            onChange={(e) => setForecastParams({ alpha: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0.1 (smooth)</span>
            <span>0.9 (reactive)</span>
          </div>
        </div>
      )}

      {/* Lag Period (for pos_lag) */}
      {forecastParams.method === 'pos_lag' && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Lag Period: {forecastParams.lagPeriod ?? 2} months
          </label>
          <input
            type="range"
            min={1}
            max={3}
            value={forecastParams.lagPeriod ?? 2}
            onChange={(e) => setForecastParams({ lagPeriod: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>3</span>
          </div>
        </div>
      )}

      {/* Seasonality toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="seasonality"
          checked={forecastParams.seasonalityEnabled ?? false}
          onChange={(e) => setForecastParams({ seasonalityEnabled: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="seasonality" className="text-xs text-gray-600">
          Apply seasonal indices
        </label>
      </div>

      {/* Recalculate button */}
      <button
        onClick={onRecalculate}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
      >
        Recalculate
      </button>
    </div>
  );
}
