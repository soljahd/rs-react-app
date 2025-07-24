import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Results } from '../components';
import type { Book } from '../api/api';

const mockOnPageChange = vi.fn();

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
};

describe('Results Component', () => {
  describe('Rendering Tests', () => {
    it('should render correct number of items when data is provided', () => {
      render(<Results books={mockBooks} loading={false} error={null} {...defaultProps} />);
      expect(screen.getAllByRole('article')).toHaveLength(mockBooks.length);
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });

    it('should display "no results" message when data array is empty', () => {
      render(<Results books={[]} loading={false} error={null} {...defaultProps} />);
      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/no books found/i);
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
    });

    it('should show loading state while fetching data', () => {
      render(<Results books={[]} loading={true} error={null} {...defaultProps} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('should correctly display item names and descriptions', () => {
      render(<Results books={mockBooks} loading={false} error={null} {...defaultProps} />);
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Author 1')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
      expect(screen.getByText('Author 2, Author 3')).toBeInTheDocument();
    });

    it('should handle missing or undefined data gracefully', () => {
      render(<Results books={[mockBookWithMissingData]} loading={false} error={null} {...defaultProps} />);
      expect(screen.getByText('Book with Missing Data')).toBeInTheDocument();
      expect(screen.getByText('Unknown author')).toBeInTheDocument();
      expect(screen.queryByText(/First published/i)).not.toBeInTheDocument();
    });

    it('should render column headers correctly', () => {
      render(<Results books={mockBooks} loading={false} error={null} {...defaultProps} />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should display error message when API call fails', () => {
      const errorMsg = 'Failed to fetch data';
      render(<Results books={[]} loading={false} error={errorMsg} {...defaultProps} />);
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Pagination test', () => {
    it('should call onPageChange with correct page number when provided', async () => {
      render(<Results books={mockBooks} loading={false} error={null} {...defaultProps} />);
      const nextButton = screen.getByText('>');
      await userEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });
});
