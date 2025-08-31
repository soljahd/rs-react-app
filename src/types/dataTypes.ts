export type CountryEntry = {
  iso_code?: string;
  data: Array<YearData>;
};

export type YearData = {
  year?: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  gas_co2?: number;
  coal_co2?: number;
  temperature_change_from_co2?: number;
};

export type Country = {
  name: string;
  iso?: string;
  latestPopulation: string;
  years: YearData[];
};

export const COLUMN_LABELS: Record<string, string> = {
  methane: 'Methane',
  oil_co2: 'Oil CO₂',
  gas_co2: 'Gas CO₂',
  coal_co2: 'Coal CO₂',
  temperature_change_from_co2: 'Temp. change from CO₂',
};
