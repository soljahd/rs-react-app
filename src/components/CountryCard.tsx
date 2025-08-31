import { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react';
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

const TableHeaders = memo(function TableHeaders({ selectedColumns }: { selectedColumns: string[] }) {
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
});

const DataRow = memo(function DataRow({
  row,
  selectedColumns,
  changedFields,
}: {
  row: YearData | undefined;
  selectedColumns: string[];
  changedFields: string[];
}) {
  return (
    <tr className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] border-b border-gray-100 hover:bg-gray-50">
      <td className="truncate px-3 py-2">{row?.year ?? 'N/A'}</td>

      <td
        className={`truncate px-3 py-2 transition-colors duration-700 ${
          changedFields.includes('population') ? 'bg-yellow-100' : ''
        }`}
      >
        {formatValue(row?.population)}
      </td>

      <td
        className={`truncate px-3 py-2 transition-colors duration-700 ${
          changedFields.includes('co2') ? 'bg-yellow-100' : ''
        }`}
      >
        {formatValue(row?.co2)}
      </td>

      <td
        className={`truncate px-3 py-2 transition-colors duration-700 ${
          changedFields.includes('co2_per_capita') ? 'bg-yellow-100' : ''
        }`}
      >
        {formatValue(row?.co2_per_capita)}
      </td>

      {selectedColumns.map((col) => (
        <td
          key={`${row?.year?.toString() ?? 'row'}-${col}`}
          className={`truncate px-3 py-2 transition-colors duration-700 ${
            changedFields.includes(col) ? 'bg-yellow-100' : ''
          }`}
        >
          {formatValue(row?.[col as keyof YearData])}
        </td>
      ))}
    </tr>
  );
});

function CountryCard({ country, selectedYear, selectedColumns }: Props) {
  const { name, iso, latestPopulation, years } = country;
  const [expanded, setExpanded] = useState(false);

  const prevYearDataRef = useRef<YearData | undefined>(undefined);
  const [changedFields, setChangedFields] = useState<string[]>([]);

  const yearData = useMemo(() => years.find((y) => y.year === selectedYear), [years, selectedYear]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    const prev = prevYearDataRef.current;
    const current = yearData;

    if (current && prev) {
      const diffs: string[] = [];
      const fieldsToCheck = ['population', 'co2', 'co2_per_capita', ...selectedColumns];

      fieldsToCheck.forEach((field) => {
        const prevVal = formatValue(prev[field as keyof YearData]);
        const currVal = formatValue(current[field as keyof YearData]);

        if (prevVal !== currVal) {
          diffs.push(field);
        }
      });

      setChangedFields(diffs);

      const timeout = setTimeout(() => {
        setChangedFields([]);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setChangedFields([]);
    }

    prevYearDataRef.current = current;
  }, [yearData, selectedColumns]);

  useEffect(() => {
    prevYearDataRef.current = yearData;
  }, [yearData]);

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
          <tbody>
            <DataRow row={yearData} selectedColumns={selectedColumns} changedFields={changedFields} />
          </tbody>
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
                <DataRow key={row.year} row={row} selectedColumns={selectedColumns} changedFields={[]} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default memo(CountryCard);
