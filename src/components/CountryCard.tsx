import { useState } from 'react';
import Button from './Button';
import { COLUMN_LABELS } from '../types/dataTypes';
import type { Country, YearData } from '../types/dataTypes';

type Props = {
  country: Country;
  selectedYear: number;
  selectedColumns: string[];
};

const formatValue = (value: number | undefined): string => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value.toLocaleString() : 'N/A';
  }
  return 'N/A';
};

function TableHeaders({ selectedColumns }: { selectedColumns: string[] }) {
  return (
    <>
      <th className="bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600">Year</th>
      <th className="bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600">Population</th>
      <th className="bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600">CO₂</th>
      <th className="bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600">CO₂ per capita</th>
      {selectedColumns.map((col) => (
        <th key={col} className="bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600">
          {COLUMN_LABELS[col] || col}
        </th>
      ))}
    </>
  );
}

function DataRow({
  row,
  selectedColumns,
  isHighlighted = false,
}: {
  row: YearData | undefined;
  selectedColumns: string[];
  isHighlighted?: boolean;
}) {
  return (
    <tr
      className={`grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] ${isHighlighted ? 'bg-blue-50' : 'border-b border-gray-100 hover:bg-gray-50'}`}
    >
      <td className="truncate px-3 py-2">{row?.year ? row.year : 'N/A'}</td>
      <td className="truncate px-3 py-2">{formatValue(row?.population)}</td>
      <td className="truncate px-3 py-2">{formatValue(row?.co2)}</td>
      <td className="truncate px-3 py-2">{formatValue(row?.co2_per_capita)}</td>
      {selectedColumns.map((col) => (
        <td key={`${row?.year ? row.year.toString() : 'row'}-${col}`} className="truncate px-3 py-2">
          {formatValue(row?.[col as keyof YearData])}
        </td>
      ))}
    </tr>
  );
}

function CountryCard({ country, selectedYear, selectedColumns }: Props) {
  const { name, iso, latestPopulation, years } = country;
  const [expanded, setExpanded] = useState(false);

  const yearData = years.find((yearData) => yearData.year === selectedYear);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" aria-live="polite">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col flex-wrap gap-1 text-lg">
          <div className="flex gap-4">
            <h3 className="truncate font-semibold text-gray-900">{name}</h3>
            {iso && <span className="text-gray-600">ISO code: {iso}</span>}
          </div>
          <span className="text-gray-600">Population (latest): {latestPopulation.toLocaleString()}</span>
        </div>
        <Button
          color="secondary"
          className="min-w-24 shrink-0"
          size="sm"
          onClick={toggleExpanded}
          aria-expanded={expanded}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 text-sm">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] border-b border-gray-200">
              <TableHeaders selectedColumns={selectedColumns} />
            </tr>
          </thead>
          <tbody>{<DataRow row={yearData} selectedColumns={selectedColumns} isHighlighted={true} />}</tbody>
        </table>
      </div>

      {expanded && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 text-sm">
          <table className="w-full">
            <thead>
              <tr className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] border-b border-gray-200">
                <TableHeaders selectedColumns={selectedColumns} />
              </tr>
            </thead>
            <tbody>
              {years.map((row) => (
                <DataRow key={row.year} row={row} selectedColumns={selectedColumns} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CountryCard;
