'use client';

import { ReactNode, createContext, useContext } from 'react';
import Results from '@/components/Results';
import Search from '@/components/Search';
import SelectedBooksFlyout from '@/components/SelectedBooksFlyout';
import { useBookManager, ITEMS_PER_PAGE } from '@/hooks/useBookManager';
import { BookDetails } from '@/types';

type BookDetailsContextType = {
  bookDetails: BookDetails | undefined;
  loading: boolean;
  bookId: string | null;
  onClose: () => void;
  onRefresh: () => void;
};

const BookDetailsContext = createContext<BookDetailsContextType | null>(null);

export function useBookDetails() {
  const context = useContext(BookDetailsContext);
  if (!context) {
    throw new Error('useBookDetails must be used within a HomeLayout');
  }
  return context;
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  const {
    query,
    currentPage,
    bookId,
    isLoading,
    detailsLoading,
    error,
    results,
    bookDetails,
    totalBooks,
    handleSearch,
    handlePageChange,
    handleBookSelect,
    handleCloseDetails,
    refetchSearchData,
    refetchBookDetails,
  } = useBookManager();

  return (
    <BookDetailsContext.Provider
      value={{
        bookDetails,
        bookId,
        loading: detailsLoading,
        onClose: handleCloseDetails,
        onRefresh: refetchBookDetails,
      }}
    >
      <div className="flex w-full flex-1 flex-col gap-8">
        <div className="top-controls">
          <Search loading={isLoading} initialValue={query} onSearch={handleSearch} />
        </div>
        <div className="results flex h-188 gap-4">
          <Results
            loading={isLoading}
            error={error}
            books={results}
            totalBooks={totalBooks}
            booksPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onBookSelect={handleBookSelect}
            selectedBookId={bookId}
            className={`${bookId ? 'w-1/2' : 'w-full'} min-w-1/2`}
            onRefresh={refetchSearchData}
          />
          {children}
          <SelectedBooksFlyout />
        </div>
      </div>
    </BookDetailsContext.Provider>
  );
}
