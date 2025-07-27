import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorageQuery } from './useLocalStorageQuery';
import { searchBooks, getBookDetails } from '../api/api';
import type { Book, BookDetails } from '../api/api';

export const ITEMS_PER_PAGE = 4;

export const useBookManager = () => {
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);

  const [query, setQuery] = useLocalStorageQuery('searchQuery');
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const bookId = searchParams.get('details');

  useEffect(() => {
    if (!searchParams.has('page')) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  const searchData = useCallback(
    async (query: string, page: number = currentPage, limit: number = ITEMS_PER_PAGE) => {
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
    },
    [currentPage],
  );

  const loadBookDetails = useCallback(async (id: string) => {
    setDetailsLoading(true);
    try {
      const details = await getBookDetails(id);
      setBookDetails(details);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      if (!initialized) {
        await searchData(query);
        if (bookId) await loadBookDetails(bookId);
        setInitialized(true);
      }
    };
    initializeData().catch(() => {});
  }, [bookId, initialized, loadBookDetails, query, searchData]);

  const handleSearchRequest = async (query: string) => {
    setResults([]);
    setQuery(query);
    setBookDetails(null);
    setSearchParams((prev) => {
      prev.set('page', '1');
      prev.delete('details');
      return prev;
    });
    await searchData(query, 1);
  };

  const handleSearch = (query: string) => {
    handleSearchRequest(query).catch(() => {});
  };

  const handleOnPageChangeRequest = async (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      prev.delete('details');
      return prev;
    });
    setBookDetails(null);
    await searchData(query, page);
  };

  const handlePageChange = (page: number) => {
    handleOnPageChangeRequest(page).catch(() => {});
  };

  const handleBookSelectRequest = async (bookId: string | null) => {
    setSearchParams((prev) => {
      if (bookId) {
        prev.set('details', bookId);
      } else {
        prev.delete('details');
        setBookDetails(null);
      }
      return prev;
    });

    if (bookId) await loadBookDetails(bookId);
  };

  const handleBookSelect = (bookId: string | null) => {
    handleBookSelectRequest(bookId).catch(() => {});
  };

  const handleCloseDetails = () => {
    setSearchParams((prev) => {
      prev.delete('details');
      return prev;
    });
    setBookDetails(null);
  };

  return {
    query,
    currentPage,
    bookId,
    isLoading,
    detailsLoading,
    error,
    results,
    bookDetails,
    totalBooks,
    handleSearch,
    handlePageChange,
    handleBookSelect,
    handleCloseDetails,
  };
};
