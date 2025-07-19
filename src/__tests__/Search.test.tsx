import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Search } from '../components';

describe('Search Component', () => {
  const mockOnSearch = vi.fn(() => Promise.resolve());
  let user: ReturnType<typeof userEvent.setup>;

  const defaultProps = {
    loading: false,
    initialValue: '',
    onSearch: mockOnSearch,
  };

  beforeEach(() => {
    user = userEvent.setup();
    mockOnSearch.mockClear();
  });

  it('should render search form with accessible elements', () => {
    render(<Search {...defaultProps} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('should display initial value in input field', () => {
    render(<Search {...defaultProps} initialValue="initial query" />);
    expect(screen.getByRole('textbox')).toHaveValue('initial query');
  });

  it('should update input value when user types', async () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('should call onSearch with trimmed value when form is submitted', async () => {
    render(<Search {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    await user.type(input, '  search term  ');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('search term');
  });

  it('should disable button and show loading state', () => {
    render(<Search {...defaultProps} loading={true} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should handle empty search query', async () => {
    render(<Search {...defaultProps} />);
    await user.click(screen.getByRole('button'));
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
