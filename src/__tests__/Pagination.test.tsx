import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, afterEach, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from '../components';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when totalPages is 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render all pages when total pages <= 7 (with siblingCount=1)', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('should show right dots when pages > 7 and current page at the beginning', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should show left dots when pages > 7 and current page at the end', () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should show dots on both sides when pages > 7 and current page in the middle', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(2);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should call onPageChange when page number is clicked', async () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should not call onPageChange when current page is clicked', async () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText('2'));
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange when ellipsis is clicked', async () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText('…'));
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should disable previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('<')).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('>')).toBeDisabled();
  });

  it('should call onPageChange with previous page when previous button is clicked', async () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText('<'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange with next page when next button is clicked', async () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByText('>'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should show more sibling pages when siblingCount is increased', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={mockOnPageChange} siblingCount={2} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
