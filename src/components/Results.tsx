import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import Pagination from './Pagination';
import Spinner from './Spinner';
import { toggleBookSelection, selectSelectedBooks } from '../store/booksSlice';
import type { Book } from '../types';
import type { ReactNode, ChangeEvent, MouseEvent } from 'react';

type ResultsProps = {
  loading: boolean;
  error: string | null;
  books: Book[];
  totalBooks: number;
  booksPerPage: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  onBookSelect?: (bookId: string | null) => void;
  selectedBookId?: string | null;
  className?: string;
  onRefresh: () => void;
};

function ResultsContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="region"
      className={`results flex min-w-128 flex-grow flex-col justify-between gap-4 rounded-lg border border-gray-200 p-2 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div role="alert" className="results_content results_error text-red-500 dark:text-red-400">
      {error}
    </div>
  );
}

function EmptyState() {
  return (
    <p role="status" className="results_content text-gray-500 dark:text-gray-400">
      No books found. Try another search.
    </p>
  );
}

function BooksList({
  books,
  onSelect,
  selectedBookId,
}: {
  books: Book[];
  onSelect?: (bookId: string | null) => void;
  selectedBookId?: string | null;
}) {
  return (
    <div role="list" aria-label="List of books" className="results_content flex w-full flex-wrap gap-2">
      <div role="presentation" className="results_item flex w-full rounded-lg bg-gray-100 p-2 text-xl dark:bg-gray-700">
        <h3 className="results_item-title flex w-1/2 font-medium dark:text-white">Title</h3>
        <h3 className="results_item-description flex w-1/2 font-medium dark:text-white">Description</h3>
      </div>
      {books.map((book) => (
        <BookItem
          key={book.key}
          book={book}
          onSelect={onSelect}
          isSelected={selectedBookId === book.key.replace('/works/OL', '')}
        />
      ))}
    </div>
  );
}

function BookItem({
  book,
  onSelect,
  isSelected,
}: {
  book: Book;
  onSelect?: (bookId: string | null) => void;
  isSelected?: boolean;
}) {
  const dispatch = useDispatch();
  const selectedBooks = useSelector(selectSelectedBooks);

  const bookId = book.key.replace('/works/OL', '');
  const isChecked = selectedBooks.some((b) => b.id === bookId);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleBookSelection(book));
  };

  const handleCheckboxClick = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleClick = () => {
    if (!onSelect || !book.key) return;
    onSelect(isSelected ? null : bookId);
  };

  return (
    <div
      role="article"
      aria-label="Books"
      className={`results_item flex h-32 w-full cursor-pointer overflow-y-auto rounded-lg border border-gray-200 p-2 text-xl hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-gray-700 ${
        isSelected ? 'border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-gray-600' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex w-1/12 items-center text-red-400">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          className="h-8 w-8 cursor-pointer accent-blue-600 dark:accent-blue-500"
        />
      </div>
      <div className="flex w-5/12 font-medium dark:text-white">{book.title}</div>
      <div className="flex w-6/12 text-gray-600 dark:text-gray-300">
        <ul className="flex flex-col gap-1">
          <li className="flex gap-2">
            <span className="font-semibold">Author:</span>
            <span>{book.author_name?.join(', ') || 'Unknown author'}</span>
          </li>
          {book.first_publish_year && (
            <li className="flex gap-2">
              <span className="font-semibold">First published:</span>
              <span>{book.first_publish_year}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Results({
  loading,
  error,
  books,
  totalBooks,
  booksPerPage,
  currentPage,
  onPageChange,
  onBookSelect,
  selectedBookId,
  className,
  onRefresh,
}: ResultsProps) {
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  if (loading && books.length > 0) {
    return (
      <ResultsContainer className={className}>
        <LoadingState />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          siblingCount={1}
        />
      </ResultsContainer>
    );
  }

  if (loading) {
    return (
      <ResultsContainer className={className}>
        <LoadingState />
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer className={className}>
        <ErrorState error={error} />
      </ResultsContainer>
    );
  }

  if (books.length === 0) {
    return (
      <ResultsContainer className={className}>
        <EmptyState />
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer className={className}>
      <Button type="button" loading={loading} className="min-w-24" onClick={onRefresh}>
        Refresh
      </Button>
      <BooksList books={books} onSelect={onBookSelect} selectedBookId={selectedBookId} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} siblingCount={1} />
    </ResultsContainer>
  );
}

export { BookItem };
export default Results;
