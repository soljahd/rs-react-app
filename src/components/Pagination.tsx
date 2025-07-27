import Button from './Button';
import type { MouseEvent, ReactNode } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  function generatePaginationItems(): (number | '...')[] {
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    return [1, '...', ...range(leftSiblingIndex, rightSiblingIndex), '...', totalPages];
  }

  const handlePageClick = (page: number | '...') => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPaginationItem = (item: number | '...', index: number): ReactNode => {
    if (item === '...') {
      return (
        <span
          key={`dots-${index.toString()}`}
          className="min-w-8 px-2 py-1 text-center text-sm hover:cursor-default"
          aria-hidden="true"
        >
          &hellip;
        </span>
      );
    }

    return (
      <Button
        key={item}
        onClick={handlePageClick(item)}
        color={item === currentPage ? 'primary' : 'ghost'}
        size="sm"
        className="min-w-8"
        active={item === currentPage}
        aria-current={item === currentPage ? 'page' : undefined}
        aria-label={`Go to page ${item.toString()}`}
      >
        {item}
      </Button>
    );
  };

  const paginationItems = generatePaginationItems();

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 p-2" aria-label="Pagination">
      <Button
        onClick={handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        color="ghost"
        size="sm"
        className="min-w-8"
        aria-label="Previous page"
      >
        {'<'}
      </Button>

      <div className="flex items-center gap-2">{paginationItems.map(renderPaginationItem)}</div>

      <Button
        onClick={handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        color="ghost"
        size="sm"
        className="min-w-8"
        aria-label="Next page"
        aria-role="Next page"
      >
        {'>'}
      </Button>
    </nav>
  );
}

export default Pagination;
