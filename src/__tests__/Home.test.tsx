import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import * as api from '../api/api';
import { Home, ResultsDetails } from '../components';
import { store } from '../store';
import type { Mock } from 'vitest';

const mockBooks = {
  docs: [
    { key: 'book1', title: 'Book One', author_name: ['Author One'] },
    { key: 'book2', title: 'Book Two', author_name: ['Author Two'] },
    { key: 'book3', title: 'Book Three', author_name: ['Author Three'] },
    { key: 'book4', title: 'Book Four', author_name: ['Author Four'] },
    { key: 'book5', title: 'Book Five', author_name: ['Author Five'] },
  ],
  numFound: 5,
};

const mockBookDetails = {
  key: 'book1',
  title: 'Detailed Book',
  authors: [{ name: 'Detailed Author', key: 'author1' }],
  description: 'Test description',
};

vi.mock('../api/api', async () => {
  const actual = await vi.importActual<typeof import('../api/api')>('../api/api');
  return {
    ...actual,
    useSearchBooksQuery: vi.fn(),
    useGetBookDetailsQuery: vi.fn(),
  };
});

const useSearchBooksQueryMock = api.useSearchBooksQuery as Mock;
const useGetBookDetailsQueryMock = api.useGetBookDetailsQuery as Mock;

describe('Home Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useSearchBooksQueryMock.mockReset();
    useGetBookDetailsQueryMock.mockReset();
  });

  const renderApp = (searchQuery = '') => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/main${searchQuery}`]}>
          <Routes>
            <Route path="/main" element={<Home />}>
              <Route path="/main" element={<ResultsDetails />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render without crashing', () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should use localStorage search term on initial load', async () => {
    localStorage.setItem('searchQuery', 'harry potter');

    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByDisplayValue('harry potter')).toBeInTheDocument();
    });
  });

  it('should show loading state when searching', () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should render book results on successful API response', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
      expect(screen.getByText('Book Two')).toBeInTheDocument();
    });
  });

  it('should show error message when API fails', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: { message: 'API failed' },
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/API failed/i)).toBeInTheDocument();
    });
  });

  it('should update localStorage after search', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();

    const input = screen.getByRole('textbox', { name: /search/i });
    const searchButton = await screen.findByRole('button', { name: /search/i });

    await userEvent.clear(input);
    await userEvent.type(input, 'gatsby');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(localStorage.getItem('searchQuery')).toBe('gatsby');
    });
  });

  it('should show loading state when fetching book details', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp('?page=1&details=book1');

    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('should load book details when bookId is in URL', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: mockBookDetails,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp('?page=1&details=book1');

    await waitFor(() => {
      expect(screen.getByText('Detailed Book')).toBeInTheDocument();
    });
  });

  it('should clear book details when closing details view', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: mockBookDetails,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp('?page=1&details=book1');

    const closeButton = await screen.findByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Detailed Book')).not.toBeInTheDocument();
    });
  });

  it('should show empty state when no results found', async () => {
    useSearchBooksQueryMock.mockReturnValue({
      data: { docs: [], numFound: 0 },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/no books found/i)).toBeInTheDocument();
    });
  });

  it('should maintain search query in input field', async () => {
    localStorage.setItem('searchQuery', 'persisted query');

    useSearchBooksQueryMock.mockReturnValue({
      data: mockBooks,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    useGetBookDetailsQueryMock.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByDisplayValue('persisted query')).toBeInTheDocument();
    });
  });
});
