'use client';

import { useAppStore } from '@/lib/store';
import { FilterOptions } from '@/types';

interface FilterBarProps {
  options: FilterOptions;
}

export function FilterBar({ options }: FilterBarProps) {
  const { filters, setFilter, resetFilters } = useAppStore();

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
          <select
            value={filters.customerId ?? ''}
            onChange={(e) => setFilter('customerId', e.target.value || null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">All Customers</option>
            {options.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
          <select
            value={filters.brand ?? ''}
            onChange={(e) => setFilter('brand', e.target.value || null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">All Brands</option>
            {options.brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select
            value={filters.type ?? ''}
            onChange={(e) => setFilter('type', e.target.value || null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">All Types</option>
            {options.types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Formation</label>
          <select
            value={filters.formation ?? ''}
            onChange={(e) => setFilter('formation', e.target.value || null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">All Formations</option>
            {options.formations.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
          <select
            value={filters.productId ?? ''}
            onChange={(e) => setFilter('productId', e.target.value || null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">All Products</option>
            {options.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.productName || p.productNumber}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
