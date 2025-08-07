import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SearchBooksResponse, BookDetails } from '../types';

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://openlibrary.org',
    timeout: 5000,
  }),
  tagTypes: ['Book', 'BookList'],
  endpoints: (builder) => ({
    searchBooks: builder.query<SearchBooksResponse, { query: string; page: number; limit: number }>({
      query: ({ query, page, limit }) => ({
        url: '/search.json',
        params: {
          q: query,
          offset: (page - 1) * limit,
          limit,
        },
      }),
      providesTags: ['BookList'],
      keepUnusedDataFor: 300,
    }),
    getBookDetails: builder.query<BookDetails, string>({
      query: (bookId) => `/works/OL${bookId}.json`,
      providesTags: ['Book'],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useSearchBooksQuery, useGetBookDetailsQuery } = booksApi;
