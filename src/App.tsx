import { useState, useEffect } from 'react';
import { searchBooks } from './api/api';
import { Button, Results, Search } from './components';
import type { Book } from './api/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const initialQuery = localStorage.getItem('searchQuery') || '';

  const searchData = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchBooks(query);
      setResults(response.docs);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void searchData(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (query: string) => {
    localStorage.setItem('searchQuery', query);
    await searchData(query);
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
        <Search loading={isLoading} initialValue={initialQuery} onSearch={handleSearch} />
      </div>
      <div className="results min-h-96">
        <Results loading={isLoading} error={error} books={results} />
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
