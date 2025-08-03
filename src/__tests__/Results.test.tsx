import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Results } from '../components';
import { BookItem } from '../components/Results';
import { store } from '../store';
import type { Book } from '../api/api';

const mockOnPageChange = vi.fn();
const mockOnSelect = vi.fn();

const mockBooks: Book[] = [
  {
    key: '1',
    title: 'Test Book 1',
    author_name: ['Author 1'],
    first_publish_year: 2000,
  },
  {
    key: '2',
    title: 'Test Book 2',
    author_name: ['Author 2', 'Author 3'],
    first_publish_year: 2010,
  },
];

const mockBookWithMissingData: Book = {
  key: '3',
  title: 'Book with Missing Data',
  author_name: undefined,
  first_publish_year: undefined,
};

const defaultProps = {
  totalBooks: 20,
  booksPerPage: 10,
  currentPage: 1,
  onPageChange: mockOnPageChange,
  onBookSelect: mockOnSelect,
};

describe('Results Component', () => {
  const renderResults = (props = {}) => {
    return render(
      <Provider store={store}>
        <Results books={mockBooks} loading={false} error={null} {...defaultProps} {...props} />
      </Provider>,
    );
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('should render correct number of items when data is provided', () => {
      renderResults();
      expect(screen.getAllByRole('article')).toHaveLength(mockBooks.length);
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });

    it('should display "no results" message when data array is empty', () => {
      renderResults({ books: [] });
      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/no books found/i);
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
    });

    it('should show loading state while fetching data', () => {
      renderResults({ books: [], loading: true });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('should correctly display item names and descriptions', () => {
      renderResults();
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Author 1')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
      expect(screen.getByText('Author 2, Author 3')).toBeInTheDocument();
    });

    it('should handle missing or undefined data gracefully', () => {
      renderResults({ books: [mockBookWithMissingData] });
      expect(screen.getByText('Book with Missing Data')).toBeInTheDocument();
      expect(screen.getByText('Unknown author')).toBeInTheDocument();
      expect(screen.queryByText(/First published/i)).not.toBeInTheDocument();
    });

    it('should render column headers correctly', () => {
      renderResults();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should display error message when API call fails', () => {
      const errorMsg = 'Failed to fetch data';
      renderResults({ books: [], error: errorMsg });
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Pagination test', () => {
    it('should show loading spinner and pagination when loading with existing books', () => {
      renderResults({ loading: true });

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();

      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();

      expect(screen.queryByRole('article')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Book 1')).not.toBeInTheDocument();
    });

    it('should call onPageChange with correct page number when provided', async () => {
      renderResults();
      const nextButton = screen.getByText('>');
      await userEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('BookItem handleClick', () => {
    const mockBook: Book = {
      key: '/works/OL123W',
      title: 'Test Book',
      author_name: ['Test Author'],
      first_publish_year: 2020,
    };

    const renderBookItem = (props = {}) => {
      return render(
        <Provider store={store}>
          <BookItem book={mockBook} onSelect={mockOnSelect} {...props} />
        </Provider>,
      );
    };

    it('should call onSelect with book ID when clicked and not selected', async () => {
      renderBookItem({ isSelected: false });
      await userEvent.click(screen.getByRole('article'));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith('123W');
    });

    it('should call onSelect with null when clicked and already selected', async () => {
      renderBookItem({ isSelected: true });
      await userEvent.click(screen.getByRole('article'));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(null);
    });

    it('should not call onSelect when onSelect is not provided', async () => {
      renderBookItem({ onSelect: undefined, isSelected: false });
      await userEvent.click(screen.getByRole('article'));
      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('should correctly extract ID from book.key', async () => {
      const bookWithDifferentKey = {
        ...mockBook,
        key: '/works/OL456W',
      };
      renderBookItem({ book: bookWithDifferentKey, isSelected: false });
      await userEvent.click(screen.getByRole('article'));
      expect(mockOnSelect).toHaveBeenCalledWith('456W');
    });

    it('should not trigger parent click handler when checkbox is clicked', async () => {
      const mockOnSelect = vi.fn();
      renderBookItem({ onSelect: mockOnSelect });

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });
});
