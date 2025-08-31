import CountryCard from './CountryCard';
import type { Country } from '../types/dataTypes';

type Props = {
  countries: Country[];
  selectedYear: number;
  searchQuery: string;
  sortBy: 'name' | 'population';
  sortDirection: 'asc' | 'desc';
  selectedColumns: string[];
};

function isCountryMatchesSearch(country: Country, searchQuery: string) {
  if (!searchQuery) return true;
  return country.name.toLowerCase().includes(searchQuery.toLowerCase());
}

function getCountryPopulationForYear(country: Country, year: number): number | null {
  const yearData = country.years.find((yearData) => yearData.year === year);
  return yearData?.population ?? null;
}

function CountryList({ countries, selectedYear, searchQuery, sortBy, sortDirection, selectedColumns }: Props) {
  const filteredCountries = searchQuery
    ? countries.filter((country) => isCountryMatchesSearch(country, searchQuery))
    : [...countries];

  const sortedCountries = [...filteredCountries].sort((firstCountry, secondCountry) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? firstCountry.name.localeCompare(secondCountry.name)
        : secondCountry.name.localeCompare(firstCountry.name);
    } else {
      const firstCountryPopulation = getCountryPopulationForYear(firstCountry, selectedYear) ?? 0;
      const secondCountryPopulation = getCountryPopulationForYear(secondCountry, selectedYear) ?? 0;
      return sortDirection === 'asc'
        ? firstCountryPopulation - secondCountryPopulation
        : secondCountryPopulation - firstCountryPopulation;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      {sortedCountries.map((country) => (
        <CountryCard
          key={country.name}
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      ))}
    </div>
  );
}

export default CountryList;
