import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import * as api from '../api/api';
import App, { ITEMS_PER_PAGE } from '../App';
import ErrorBoundary from '../components/ErrorBoundary';

const mockBooks = {
  docs: [
    { key: 'book1', title: 'Book One', author_name: ['Author One'] },
    { key: 'book2', title: 'Book Two', author_name: ['Author Two'] },
  ],
  numFound: 2,
};

describe('App Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const renderApp = () => {
    return render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
  };

  it('makes initial API call on component mount', async () => {
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    renderApp();

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledWith('', 0, ITEMS_PER_PAGE);
    });
  });

  it('uses localStorage search term on initial load', async () => {
    localStorage.setItem('searchQuery', 'harry potter');
    const searchSpy = vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    renderApp();

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledWith('harry potter', 0, ITEMS_PER_PAGE);
    });
  });

  it('shows loading state when searching', async () => {
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

  it('calls API with correct parameters when user searches', async () => {
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

  it('renders book results on successful API response', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
      expect(screen.getByText('Book Two')).toBeInTheDocument();
    });
  });

  it('shows error message when API fails', async () => {
    vi.spyOn(api, 'searchBooks').mockRejectedValue(new Error('API failed'));
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/API failed/i)).toBeInTheDocument();
    });
  });

  it('updates state with new results after successful search', async () => {
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Book One')).toBeInTheDocument();
    });
  });

  it('displays fallback UI when App throws after clicking error button', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(api, 'searchBooks').mockResolvedValue(mockBooks);

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </MemoryRouter>,
    );

    const throwButton = await screen.findByRole('button', { name: /throw error/i });
    await userEvent.click(throwButton);

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
  });

  it('handles search from user input and updates localStorage, state, and results', async () => {
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
});
