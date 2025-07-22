import { useState } from 'react';
import Button from './Button';
import type { ChangeEvent, FormEvent } from 'react';

type SearchProps = {
  loading: boolean;
  initialValue: string;
  onSearch: (query: string) => Promise<void>;
};

function Search({ loading, initialValue, onSearch }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const submitSearchRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSearch(searchQuery.trim());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    submitSearchRequest(event).catch(() => {});
  };

  return (
    <form onSubmit={handleSubmit} className="search flex gap-4" role="search">
      <input
        aria-label="Search"
        aria-busy={loading}
        disabled={loading}
        type="text"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 focus:border-blue-700 focus:outline-none"
        value={searchQuery}
        placeholder="Enter book title or author..."
        onChange={handleChange}
      />
      <Button type="submit" loading={loading}>
        Search
      </Button>
    </form>
  );
}

export default Search;
