import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorageQuery } from './useLocalStorageQuery';
import { useSearchBooksQuery, useGetBookDetailsQuery } from '../api/api';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const ITEMS_PER_PAGE = 4;

export const useBookManager = () => {
  const [query, setQuery] = useLocalStorageQuery('searchQuery');
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const bookId = searchParams.get('details');

  useEffect(() => {
    if (!searchParams.has('page')) {
      setSearchParams({ page: '1' });
    }
  }, [searchParams, setSearchParams]);

  const {
    data: searchData,
    isFetching: isSearchFetching,
    error: searchError,
  } = useSearchBooksQuery({ query: query === '' ? 'popular' : query, page: currentPage, limit: ITEMS_PER_PAGE });

  const {
    data: bookDetails,
    isFetching: isDetailsFetching,
    error: detailsError,
  } = useGetBookDetailsQuery(bookId || '', { skip: !bookId });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearchParams((prev) => {
      prev.set('page', '1');
      prev.delete('details');
      return prev;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      prev.delete('details');
      return prev;
    });
  };

  const handleBookSelect = (id: string | null) => {
    setSearchParams((prev) => {
      if (id) {
        prev.set('details', id);
      } else {
        prev.delete('details');
      }
      return prev;
    });
  };

  const handleCloseDetails = () => {
    setSearchParams((prev) => {
      prev.delete('details');
      return prev;
    });
  };

  const parseError = (error: FetchBaseQueryError | SerializedError | undefined): string | null => {
    if (!error) return null;
    if ('status' in error) {
      return error.status.toString();
    }
    return error.message || 'Unknown error';
  };

  return {
    query,
    currentPage,
    bookId,
    isLoading: isSearchFetching,
    detailsLoading: isDetailsFetching,
    error: parseError(searchError || detailsError),
    results: searchData?.docs || [],
    bookDetails,
    totalBooks: searchData?.numFound || 0,
    handleSearch,
    handlePageChange,
    handleBookSelect,
    handleCloseDetails,
  };
};
