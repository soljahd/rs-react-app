import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import * as api from '../api/api';
import { Home, ResultsDetails } from '../components';
import { ITEMS_PER_PAGE } from '../hooks/useBookManager';
import { store } from '../store';

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

describe('Home Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
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

  it('should renders without crashing', () => {
    renderApp();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should makes initial API call on component mount', async () => {
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    renderApp();

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledWith('', 0, ITEMS_PER_PAGE);
    });
  });

  it('should uses localStorage search term on initial load', async () => {
    localStorage.setItem('searchQuery', 'harry potter');
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp();

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledWith('harry potter', 0, ITEMS_PER_PAGE);
    });
  });

  it('should shows loading state when searching', async () => {
    vi.spyOn(api, 'searchBooks').mockImplementation(() => {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(mockBooks);
        }, 500),
      );
    });

    renderApp();
    expect(screen.getByRole('textbox')).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  it('should calls API with correct parameters when user searches', async () => {
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp();
    const input = screen.getByRole('textbox', { name: 'Search' });
    const searchButton = await screen.findByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'lord of the rings');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(searchSpy).toHaveBeenLastCalledWith('lord of the rings', 0, ITEMS_PER_PAGE);
    });
  });

  it('should renders book results on successful API response', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
      expect(screen.getByText('Book Two')).toBeInTheDocument();
    });
  });

  it('should shows error message when API fails', async () => {
    vi.spyOn(api, 'searchBooks').mockRejectedValue(new Error('API failed'));
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/API failed/i)).toBeInTheDocument();
    });
  });

  it('should updates state with new results after successful search', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
    });
  });

  it('should handles search from user input and updates localStorage, state, and results', async () => {
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp();

    const input = screen.getByRole('textbox', { name: 'Search' });
    const searchButton = await screen.findByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'gatsby');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(localStorage.getItem('searchQuery')).toBe('gatsby');
    });

    expect(searchSpy).toHaveBeenLastCalledWith('gatsby', 0, ITEMS_PER_PAGE);
  });

  it('should handles pagination correctly', async () => {
    const user = userEvent.setup();
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp('/?page=2');

    const nextPage = await screen.findByText('<');
    await user.click(nextPage);

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledWith('', (2 - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
    });
  });

  it('should set error when get details error request', async () => {
    const errorMessage = 'Network Error';
    vi.spyOn(api, 'getBookDetails').mockRejectedValue(new Error(errorMessage));
    renderApp('/?page=1&details=book1');

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should loads book details when bookId is in URL', async () => {
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    const detailsSpy = vi.spyOn(api, 'getBookDetails').mockResolvedValue(mockBookDetails);

    renderApp('?details=book1');

    await waitFor(() => {
      expect(detailsSpy).toHaveBeenCalledWith('book1');
    });
    expect(searchSpy).toHaveBeenCalled();
  });

  it('should shows loading state when fetching book details', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    vi.spyOn(api, 'getBookDetails').mockImplementation(() => {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(mockBookDetails);
        }, 1000),
      );
    });

    renderApp('?page=1&details=book1');

    expect(await screen.findByRole('status')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('should handles book selection and unselection correctly', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    const detailsSpy = vi.spyOn(api, 'getBookDetails').mockResolvedValue(mockBookDetails);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Book One'));

    await waitFor(() => {
      expect(detailsSpy).toHaveBeenCalledWith('book1');
    });

    await userEvent.click(screen.getByText('Book One'));

    await waitFor(() => {
      expect(detailsSpy).toHaveBeenCalledWith('book1');
    });
  });

  it('should resets to page 1 when performing a new search', async () => {
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp('?page=2');

    const input = screen.getByRole('textbox', { name: 'Search' });
    const searchButton = await screen.findByRole('button', { name: 'Search' });

    await userEvent.clear(input);
    await userEvent.type(input, 'new search');
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(searchSpy).toHaveBeenLastCalledWith('new search', 0, ITEMS_PER_PAGE);
    });
  });

  it('should clears book details when closing details view', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    vi.spyOn(api, 'getBookDetails').mockResolvedValue(mockBookDetails);

    renderApp('?page=1&details=book1');

    await waitFor(() => {
      expect(screen.getByText('Book Details')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Book Details')).not.toBeInTheDocument();
    });
  });

  it('should shows empty state when no results found', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue({ docs: [], numFound: 0 });
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/no books found/i)).toBeInTheDocument();
    });
  });

  it('should maintains search query in input field', async () => {
    localStorage.setItem('searchQuery', 'persisted query');
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp();

    await waitFor(() => {
      expect(screen.getByDisplayValue('persisted query')).toBeInTheDocument();
    });
  });
});
