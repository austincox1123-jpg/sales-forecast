'use client';

import { useState } from 'react';
import { DashboardRow } from '@/types';
import { useAppStore } from '@/lib/store';
import { exportToExcel } from '@/lib/excel/exporter';

interface ExportDialogProps {
  rows: DashboardRow[];
  onClose: () => void;
}

export function ExportDialog({ rows, onClose }: ExportDialogProps) {
  const { filters, forecastParams } = useAppStore();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToExcel(rows, {
        customerName: filters.customerId ?? 'All Customers',
        productName: filters.productId ?? 'All Products',
        configMethod: forecastParams.method,
        configParams: {
          source: forecastParams.source,
          window: forecastParams.window,
          weightProfile: forecastParams.weightProfile ?? 'equal',
          alpha: forecastParams.alpha ?? 'N/A',
          seasonality: forecastParams.seasonalityEnabled ? 'Yes' : 'No',
        },
        fileName: `forecast_${filters.customerId ?? 'all'}_${filters.productId ?? 'all'}.xlsx`,
      });
      onClose();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export to Excel</h2>

        <p className="text-sm text-gray-600 mb-4">
          Export will include 5 tabs: History, Existing Forecast, Statistical Forecast, Final
          Forecast, and Config details.
        </p>
        <p className="text-xs text-gray-400 mb-4">
          {rows.length} rows based on current filters
        </p>

        <button
          onClick={handleExport}
          disabled={exporting || rows.length === 0}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
        >
          {exporting ? 'Generating...' : 'Download Excel'}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 text-gray-600 text-sm hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
