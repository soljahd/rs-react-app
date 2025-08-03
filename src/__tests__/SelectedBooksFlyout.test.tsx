import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';
import SelectedBooksFlyout from '../components/SelectedBooksFlyout';
import selectedBooksReducer, { clearSelectedBooks } from '../store/booksSlice';
import type { SelectedBook } from '../store/booksSlice';

vi.mock('../utils/saveCSV', () => ({
  default: vi.fn(),
}));

describe('SelectedBooksFlyout', () => {
  const createStore = (selectedBooks: SelectedBook[] = []) => {
    return configureStore({
      reducer: {
        selectedBooks: selectedBooksReducer,
      },
      preloadedState: {
        selectedBooks: {
          selectedBooks,
        },
      },
    });
  };

  const selectedBooks = [
    { id: '1', title: 'Book 1', author: 'Author 1' },
    { id: '2', title: 'Book 2', author: 'Author 2' },
  ];

  const renderFlyout = (selectedBooks: SelectedBook[] = []) => {
    const store = createStore(selectedBooks);
    return render(
      <Provider store={store}>
        <SelectedBooksFlyout />
      </Provider>,
    );
  };

  it('should not render when no books are selected', () => {
    const { container } = renderFlyout();
    expect(container.firstChild).toBeNull();
  });

  it('should render when books are selected', () => {
    renderFlyout(selectedBooks);
    expect(screen.getByText('2 books selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should show singular "book" when only one is selected', () => {
    const selectedBooks = [{ id: '1', title: 'Book 1', author: 'Author 1' }];
    renderFlyout(selectedBooks);
    expect(screen.getByText('1 book selected')).toBeInTheDocument();
  });

  it('should dispatch clearSelectedBooks when Unselect all is clicked', () => {
    const store = createStore(selectedBooks);
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <SelectedBooksFlyout />
      </Provider>,
    );

    screen.getByText('Unselect all').click();
    expect(store.dispatch).toHaveBeenCalledWith(clearSelectedBooks());
  });

  it('should call downloadItemsAsCSV with selected books when Download is clicked', async () => {
    const { default: downloadItemsAsCSV } = await import('../utils/saveCSV');
    renderFlyout(selectedBooks);
    screen.getByText('Download').click();
    expect(downloadItemsAsCSV).toHaveBeenCalledWith(selectedBooks);
  });
});
