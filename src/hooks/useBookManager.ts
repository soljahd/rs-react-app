import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocalStorageQuery } from './useLocalStorageQuery';
import { useSearchBooksQuery, useGetBookDetailsQuery, booksApi } from '../api/api';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const ITEMS_PER_PAGE = 4;

export const useBookManager = () => {
  const [query, setQuery] = useLocalStorageQuery('searchQuery');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const bookId = searchParams.get('details');

  useEffect(() => {
    if (!searchParams.has('page')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  const {
    data: searchData,
    isFetching: isSearchFetching,
    error: searchError,
    refetch: refetchSearchData,
  } = useSearchBooksQuery({ query: query === '' ? 'popular' : query, page: currentPage, limit: ITEMS_PER_PAGE });

  const {
    data: bookDetails,
    isFetching: isDetailsFetching,
    error: detailsError,
    refetch: refetchBookDetails,
  } = useGetBookDetailsQuery(bookId || '', { skip: !bookId });

  const dispatch = useDispatch();

  const handleSearch = (newQuery: string) => {
    dispatch(booksApi.util.invalidateTags(['BookList', 'Book']));
    setQuery(newQuery);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.delete('details');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.delete('details');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleBookSelect = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('details', id);
    } else {
      params.delete('details');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCloseDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`${pathname}?${params.toString()}`);
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
    refetchSearchData: () => void refetchSearchData(),
    refetchBookDetails: () => void refetchBookDetails(),
  };
};
