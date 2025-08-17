import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Button from './Button';
import type { ChangeEvent, FormEvent } from 'react';

type SearchProps = {
  loading: boolean;
  initialValue: string;
  onSearch: (query: string) => void;
};

function Search({ loading, initialValue, onSearch }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const t = useTranslations('search');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search flex gap-4" role="search">
      <input
        aria-label={t('label')}
        aria-busy={loading}
        disabled={loading}
        type="text"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
        value={searchQuery}
        placeholder={t('placeholder')}
        onChange={handleChange}
      />
      <Button type="submit" loading={loading} className="min-w-24">
        {t('button')}
      </Button>
    </form>
  );
}

export default Search;
