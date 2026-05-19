import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sales Forecasting Engine
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload your sales data to get started. Configure statistical forecasting methods,
          compare against existing forecasts, apply overrides, and export results.
        </p>
        <Link
          href="/upload"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
        >
          Upload Your File
        </Link>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Methods</h3>
            <p className="text-sm text-gray-600">
              Average weekly run rate, weighted moving average, exponential smoothing,
              POS-to-shipment lag, and linear trend (slope).
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">Side-by-Side Comparison</h3>
            <p className="text-sm text-gray-600">
              View existing forecasts alongside statistical model outputs. Override specific
              months as needed.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">Excel Export</h3>
            <p className="text-sm text-gray-600">
              Export multi-tab workbooks with history, existing forecast, statistical forecast,
              final values, and config details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
