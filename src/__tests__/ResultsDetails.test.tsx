import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOutletContext } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ResultsDetails } from '../components';
import type { BookDetails } from '../types';

vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn(),
}));

vi.mock('./Spinner', () => ({
  default: () => <div data-testid="spinner">Spinner</div>,
}));

describe('ResultsDetails Component', () => {
  const mockBookDetails: BookDetails = {
    key: '/works/OL123W',
    title: 'Test Book',
    description: 'Test description',
    authors: [
      { name: 'Author One', key: '/authors/A1' },
      { name: 'Author Two', key: '/authors/A2' },
    ],
    first_publish_date: '2020-01-01',
    subjects: ['Fiction', 'Science Fiction'],
  };

  const mockContext = {
    bookDetails: mockBookDetails,
    loading: false,
    onClose: vi.fn(),
    bookId: '123W',
  };

  beforeEach(() => {
    vi.mocked(useOutletContext).mockReturnValue(mockContext);
  });

  it('should render loading state when loading and no bookDetails', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      bookDetails: null,
      loading: true,
      onClose: vi.fn(),
      bookId: '123W',
    });

    render(<ResultsDetails />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should return null when no bookDetails and not loading', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      bookDetails: null,
      loading: false,
      onClose: vi.fn(),
    });

    const { container } = render(<ResultsDetails />);
    expect(container.firstChild).toBeNull();
  });

  it('should render book details when bookDetails exists', () => {
    render(<ResultsDetails />);

    expect(screen.getByText('Book Details')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Author One, Author Two')).toBeInTheDocument();
    expect(screen.getByText('2020-01-01')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Science Fiction')).toBeInTheDocument();
  });

  it('should handle string description', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        description: 'Simple string description',
      },
    });

    render(<ResultsDetails />);
    expect(screen.getByText('Simple string description')).toBeInTheDocument();
  });

  it('should handle object description', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        description: { type: '/type/text', value: 'Object description' },
      },
    });

    render(<ResultsDetails />);
    expect(screen.getByText('Object description')).toBeInTheDocument();
  });

  it('should handle null object description', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        description: { type: '/type/text', value: '' },
      },
    });

    render(<ResultsDetails />);
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('should show "No description available" when no description', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        description: undefined,
      },
    });

    render(<ResultsDetails />);
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('should not render authors section when no authors', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        authors: undefined,
      },
    });

    render(<ResultsDetails />);
    expect(screen.queryByText('Authors')).not.toBeInTheDocument();
  });

  it('should not render publish date section when no date', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        first_publish_date: undefined,
      },
    });

    render(<ResultsDetails />);
    expect(screen.queryByText('First Published')).not.toBeInTheDocument();
  });

  it('should not render subjects section when no subjects', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      bookDetails: {
        ...mockBookDetails,
        subjects: undefined,
      },
    });

    render(<ResultsDetails />);
    expect(screen.queryByText('Subjects')).not.toBeInTheDocument();
  });

  it('should render loading spinner when loading with existing bookDetails', () => {
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      loading: true,
    });

    render(<ResultsDetails />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Test Book')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    vi.mocked(useOutletContext).mockReturnValue({
      ...mockContext,
      onClose: mockOnClose,
    });

    render(<ResultsDetails />);
    const closeButton = screen.getByLabelText('Close details');
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
