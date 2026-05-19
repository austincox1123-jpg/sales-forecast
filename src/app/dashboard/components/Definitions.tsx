'use client';

const METHOD_DEFINITIONS = [
  {
    name: 'Average Weekly Run Rate (Fiscal Weeks)',
    id: 'avg_weekly_run_rate',
    description:
      'Calculates the average cases sold per fiscal week over the lookback window, then multiplies by the number of fiscal weeks in each future month. Uses a standard 4-4-5 fiscal calendar (Q1: 4-4-5, Q2: 4-4-5, Q3: 4-4-5, Q4: 4-4-5) where each quarter has 13 weeks distributed across three months.',
    formula: 'Forecast(month) = (Total Cases in Lookback / Total Fiscal Weeks in Lookback) x Fiscal Weeks in Target Month',
    whenToUse:
      'Best when sales volume is directly proportional to the number of selling weeks in a month. Ideal for products with steady weekly demand that naturally varies by month length.',
  },
  {
    name: 'Weighted Moving Average',
    id: 'weighted_ma',
    description:
      'Computes a moving average over the lookback window where each month can be weighted differently. Supports equal weighting, linear decay (recent months weighted higher), or fully custom weights. Optionally applies seasonal indices.',
    formula: 'Forecast = Sum(weight[i] x value[i]) for i in lookback window, weights normalized to sum to 1',
    whenToUse:
      'Good general-purpose method. Use linear decay when recent trends matter more than older history. Use equal weights when history is stable.',
  },
  {
    name: 'Exponential Smoothing',
    id: 'exp_smoothing',
    description:
      'Single exponential smoothing (SES) applies an alpha parameter to weight recent observations exponentially more than older ones. The smoothed level at the end of history becomes the flat forecast for all future periods.',
    formula: 'Level(t) = alpha x Actual(t) + (1 - alpha) x Level(t-1); Forecast = Level(last)',
    whenToUse:
      'Best for data with no strong trend or seasonality. Alpha closer to 0.1 produces a smoother (less reactive) forecast; alpha closer to 0.9 reacts quickly to recent changes.',
  },
  {
    name: 'POS-to-Shipment Lag',
    id: 'pos_lag',
    description:
      'Analyzes the historical ratio between POS (point-of-sale) data and shipment data offset by a configurable lag period. Uses this ratio to project future shipments based on recent POS trends. Requires both POS and shipment (invoice/order) data.',
    formula: 'Shipment Ratio = avg(Shipment[t] / POS[t - lag]); Forecast(t) = POS[t - lag] x Shipment Ratio',
    whenToUse:
      'Use when POS data is a leading indicator for shipments. The lag period should reflect how far in advance POS trends predict shipment needs (typically 1-3 months).',
  },
  {
    name: 'Linear Trend (Slope)',
    id: 'linear_trend',
    description:
      'Fits a straight line (y = a + bx) to the lookback window using ordinary least-squares regression, then extrapolates forward. Captures upward or downward trends in the data. Forecast values are floored at zero.',
    formula: 'slope = (n x Sum(xy) - Sum(x) x Sum(y)) / (n x Sum(x²) - Sum(x)²); Forecast(t) = intercept + slope x t',
    whenToUse:
      'Best when data shows a clear upward or downward trend that you expect to continue. Not ideal for cyclical or volatile data — the straight-line projection can diverge from reality over long horizons.',
  },
];

export function Definitions() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Forecast Method Definitions</h2>
        <p className="text-sm text-gray-500">
          Reference guide for each statistical forecasting method available in the engine.
        </p>
      </div>

      {METHOD_DEFINITIONS.map((method) => (
        <div key={method.id} className="bg-white border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">{method.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{method.description}</p>

          <div className="bg-gray-50 rounded-md p-3 mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Formula</p>
            <p className="text-sm text-gray-800 font-mono">{method.formula}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">When to Use</p>
            <p className="text-sm text-gray-600">{method.whenToUse}</p>
          </div>
        </div>
      ))}

      <div className="bg-white border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Data Sources</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-800">POS Cases</span> — Point-of-sale data
            representing actual consumer purchases at retail. The forecast will be based on and
            project POS volumes.
          </div>
          <div>
            <span className="font-medium text-gray-800">Invoice Cases</span> — Shipment/invoice
            data representing cases shipped to customers. Default source for most methods.
          </div>
          <div>
            <span className="font-medium text-gray-800">Order Cases</span> — Customer order data
            which may include unfulfilled orders. Can lead shipments.
          </div>
          <div>
            <span className="font-medium text-gray-800">Blended</span> — Weighted combination of
            POS, Invoice, and Order data (default: 33/34/33 split).
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Fiscal Weeks per Month (4-4-5 Calendar)</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {[
            ['Jan', 4], ['Feb', 4], ['Mar', 5], ['Apr', 4],
            ['May', 4], ['Jun', 5], ['Jul', 4], ['Aug', 4],
            ['Sep', 5], ['Oct', 4], ['Nov', 4], ['Dec', 5],
          ].map(([month, weeks]) => (
            <div key={month as string} className="bg-gray-50 rounded px-3 py-2 text-center">
              <span className="font-medium text-gray-700">{month}</span>
              <span className="text-gray-500 ml-2">{weeks}w</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
