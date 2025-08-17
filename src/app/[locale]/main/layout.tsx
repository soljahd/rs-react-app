'use client';

import { ReactNode } from 'react';
import Results from '@/components/Results';
import Search from '@/components/Search';
import SelectedBooksFlyout from '@/components/SelectedBooksFlyout';
import { useBookManager, ITEMS_PER_PAGE } from '@/hooks/useBookManager';
import { BookDetailsProvider } from '@/providers/bookDetailsProvider';

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
    <BookDetailsProvider
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
    </BookDetailsProvider>
  );
}
