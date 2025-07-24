import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooks } from './api/api';
import { Button, Results, Search } from './components';
import { useLocalStorageQuery } from './hooks/useLocalStorageQuery';
import type { Book } from './api/api';

export const ITEMS_PER_PAGE = 8;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useLocalStorageQuery('searchQuery');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (!searchParams.has('page')) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  const searchData = async (query: string, page: number = currentPage, limit: number = ITEMS_PER_PAGE) => {
    const offset = (page - 1) * limit;
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchBooks(query, offset, limit);
      setResults(response.docs);
      setTotalBooks(response.numFound);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void searchData(query);
  }, []);

  const handleSearchRequest = async (query: string) => {
    setQuery(query);
    setSearchParams({ page: '1' });
    await searchData(query, 1);
  };

  const handleSearch = (query: string) => {
    handleSearchRequest(query).catch(() => {});
  };

  const handleRequestOnPageChange = async (page: number) => {
    setSearchParams({ page: page.toString() });
    await searchData(query, page);
  };

  const handlePageChange = (page: number) => {
    handleRequestOnPageChange(page).catch(() => {});
  };

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('This is a test error from the error button!');
  }

  return (
    <div className="app mx-auto flex min-h-screen max-w-5xl min-w-xs flex-col justify-start gap-8 p-4 pt-16">
      <div className="top-controls">
        <Search loading={isLoading} initialValue={query} onSearch={handleSearch} />
      </div>
      <div className="results flex min-h-[800px]">
        <Results
          loading={isLoading}
          error={error}
          books={results}
          totalBooks={totalBooks}
          booksPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="error-button flex justify-end">
        <Button color="error" onClick={throwError}>
          Throw Error
        </Button>
      </div>
    </div>
  );
}

export default App;
