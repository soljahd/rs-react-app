import { useState } from 'react';
import Button from './components/Button';
import ColumnSelectorModal from './components/ColumnSelectorModal';
import CountryList from './components/CountryList';
import { createDataResource } from './data/resource';
import type { CountryEntry, YearData } from './types/dataTypes';

const DATA_URL = '/owid-co2-data.json';
const resource = createDataResource(DATA_URL);

const additionalColumns = ['methane', 'oil_co2', 'gas_co2', 'coal_co2', 'temperature_change_from_co2'];

function App() {
  const data = resource.read();

  const countries = () => {
    return Object.entries(data).map(([countryName, entry]) => {
      const country = entry as CountryEntry;
      const name = countryName;
      const iso = country.iso_code;
      const years = Array.isArray(country.data) ? country.data : [];
      const population = years[years.length - 1].population;
      const latestPopulation = population ? population.toLocaleString() : 'N/A';
      return { name, iso, latestPopulation, years };
    });
  };

  const allYears = () => {
    const set = new Set<number>();
    countries().forEach((country) => {
      country.years.forEach((yearData: YearData) => {
        if (yearData.year) set.add(yearData.year);
      });
    });
    return Array.from(set).sort((a, b) => a - b);
  };

  const [selectedYear, setSelectedYear] = useState<number>(allYears()[allYears().length - 1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'population'>('population');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'name-asc' || value === 'name-desc') {
      setSortBy('name');
      setSortDirection(value === 'name-asc' ? 'asc' : 'desc');
    } else if (value === 'population-asc' || value === 'population-desc') {
      setSortBy('population');
      setSortDirection(value === 'population-asc' ? 'asc' : 'desc');
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const toggleModal = () => {
    setIsModalOpen((isOpen) => !isOpen);
  };

  const handleColumnsChange = (columns: string[]) => {
    setSelectedColumns(columns);
  };

  const currentSortValue = `${sortBy}-${sortDirection}`;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 bg-white p-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">CO2 Explorer</h2>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={selectedYear}
            onChange={(e) => {
              handleYearChange(Number(e.target.value));
            }}
          >
            {allYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input
            className="min-w-52 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            placeholder="Search countries"
            value={searchQuery}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={currentSortValue}
            onChange={handleSortChange}
          >
            <option value="population-desc">Population (High to Low)</option>
            <option value="population-asc">Population (Low to High)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
          <Button onClick={toggleModal}>Additional Columns</Button>
        </div>
      </div>

      <CountryList
        countries={countries()}
        selectedYear={selectedYear}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortDirection={sortDirection}
        selectedColumns={selectedColumns}
      />

      {isModalOpen && (
        <ColumnSelectorModal
          allColumns={additionalColumns}
          selectedColumns={selectedColumns}
          onClose={toggleModal}
          onSave={handleColumnsChange}
        />
      )}
    </div>
  );
}

export default App;
