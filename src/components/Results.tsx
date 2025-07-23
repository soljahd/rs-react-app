import { useState, useEffect } from 'react';
import Pagination from './Pagination';
import Spinner from './Spinner';
import type { Book } from '../api/api';
import type { ReactNode } from 'react';

type ResultsProps = {
  loading: boolean;
  error: string | null;
  books: Book[];
  totalBooks: number;
  booksPerPage: number;
  onPageChange?: (page: number) => void;
};

function ResultsContainer({ children }: { children: ReactNode }) {
  return (
    <div role="region" className="results flex flex-grow flex-col justify-between gap-4">
      <h1 className="results_header w-full text-center text-3xl">Results</h1>
      {children}
    </div>
  );
}

function LoadingState() {
  return <Spinner size="xl" />;
}

function ErrorState({ error }: { error: string }) {
  return (
    <div role="alert" className="results_content results_error text-red-500">
      {error}
    </div>
  );
}

function EmptyState() {
  return (
    <p role="status" className="results_content text-gray-500">
      No books found. Try another search.
    </p>
  );
}

function BooksList({ books }: { books: Book[] }) {
  return (
    <div role="list" aria-label="List of books" className="results_content flex w-full flex-wrap gap-2">
      <div role="presentation" className="results_item flex w-full rounded-lg bg-gray-100 p-2 text-xl">
        <h3 className="results_item-title flex w-1/2 font-medium">Title</h3>
        <h3 className="results_item-description flex w-1/2 font-medium">Description</h3>
      </div>
      {books.map((book) => (
        <BookItem key={book.key} book={book} />
      ))}
    </div>
  );
}

function BookItem({ book }: { book: Book }) {
  return (
    <div
      role="article"
      aria-label="Books"
      className="results_item flex w-full rounded-lg border border-gray-200 p-2 text-xl hover:bg-gray-50"
      key={book.key}
    >
      <div className="flex w-1/2 items-center font-medium">{book.title}</div>
      <div className="flex w-1/2 items-center text-gray-600">
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

function Results({ loading, error, books, totalBooks, booksPerPage, onPageChange }: ResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [totalBooks]);

  if (loading) {
    return (
      <ResultsContainer>
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

  if (error) {
    return (
      <ResultsContainer>
        <ErrorState error={error} />
      </ResultsContainer>
    );
  }

  if (books.length === 0) {
    return (
      <ResultsContainer>
        <EmptyState />
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <BooksList books={books} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} siblingCount={1} />
    </ResultsContainer>
  );
}

export default Results;
