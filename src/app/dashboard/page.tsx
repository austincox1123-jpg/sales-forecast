'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { FilterBar } from './components/FilterBar';
import { ChartPanel } from './components/ChartPanel';
import { DataGrid } from './components/DataGrid';
import { ForecastConfig } from './components/ForecastConfig';
import { ExportDialog } from './components/ExportDialog';
import { Definitions } from './components/Definitions';

type Tab = 'forecast' | 'definitions';

export default function DashboardPage() {
  const router = useRouter();
  const {
    fileLoaded,
    fileName,
    filterOptions,
    filters,
    forecastParams,
    runCurrentForecast,
    setOverride,
    getDashboardRows,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>('forecast');
  const [showExport, setShowExport] = useState(false);

  if (!fileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">No data loaded. Please upload a file first.</p>
        <button
          onClick={() => router.push('/upload')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Upload File
        </button>
      </div>
    );
  }

  const rows = getDashboardRows();

  const handleOverride = (month: string, value: number | null) => {
    setOverride(month, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Loaded: {fileName} ({rows.length} months)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/upload')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              New Upload
            </button>
            <button
              onClick={() => setShowExport(true)}
              disabled={rows.length === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'forecast'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Forecast
            </button>
            <button
              onClick={() => setActiveTab('definitions')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'definitions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Definitions
            </button>
          </nav>
        </div>

        {activeTab === 'forecast' && (
          <>
            <FilterBar options={filterOptions} />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ChartPanel rows={rows} />
                <div className="mt-6">
                  <DataGrid rows={rows} onOverride={handleOverride} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <ForecastConfig onRecalculate={runCurrentForecast} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'definitions' && <Definitions />}

        {showExport && (
          <ExportDialog
            rows={rows}
            onClose={() => setShowExport(false)}
          />
        )}
      </div>
    </div>
  );
}
