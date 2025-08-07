import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { booksApi } from '../api/api';

const createTestStore = () =>
  configureStore({
    reducer: {
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(booksApi.middleware),
  });

describe('booksApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('searchBooks should returns mocked data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              numFound: 1,
              start: 0,
              docs: [{ title: 'Mock Book', key: 'OL99999W' }],
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        ),
      ),
    );

    const store = createTestStore();

    const result = await store.dispatch(booksApi.endpoints.searchBooks.initiate({ query: 'mock', page: 1, limit: 10 }));
    expect(result.data).toBeDefined();
    expect(result.data?.docs[0].title).toBe('Mock Book');
  });

  it('getBookDetails should returns mocked book details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              title: 'Mock Book Details',
              description: 'Mocked description',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        ),
      ),
    );

    const store = createTestStore();

    const result = await store.dispatch(booksApi.endpoints.getBookDetails.initiate('12345'));

    if ('error' in result) {
      console.error(result.error);
    }

    expect(result.data).toBeDefined();
    expect(result.data?.title).toBe('Mock Book Details');
  });
});
