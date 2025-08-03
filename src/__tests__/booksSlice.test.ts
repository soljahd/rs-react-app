import { describe, it, expect } from 'vitest';
import { selectedBooksSlice, selectSelectedBooks } from '../store/booksSlice';
import type { Book } from '../api/api';

describe('selectedBooksSlice', () => {
  const initialState = { selectedBooks: [] };
  const mockBook: Book = {
    key: '/works/OL123W',
    title: 'Test Book',
    author_name: ['Author One'],
    first_publish_year: 2000,
  };

  describe('reducers', () => {
    describe('toggleBookSelection', () => {
      it('should add a book to selectedBooks if it does not exist', () => {
        const action = selectedBooksSlice.actions.toggleBookSelection(mockBook);
        const state = selectedBooksSlice.reducer(initialState, action);

        expect(state.selectedBooks).toHaveLength(1);
        expect(state.selectedBooks[0]).toEqual({
          id: '123W',
          title: 'Test Book',
          author: 'Author One',
          firstPublishYear: 2000,
        });
      });

      it('should remove a book from selectedBooks if it already exists', () => {
        const existingState = {
          selectedBooks: [
            {
              id: '123W',
              title: 'Test Book',
              author: 'Author One',
              firstPublishYear: 2000,
            },
          ],
        };

        const action = selectedBooksSlice.actions.toggleBookSelection(mockBook);
        const state = selectedBooksSlice.reducer(existingState, action);

        expect(state.selectedBooks).toHaveLength(0);
      });

      it('should handle book with unknown author', () => {
        const bookWithoutAuthor: Book = {
          ...mockBook,
          author_name: undefined,
        };

        const action = selectedBooksSlice.actions.toggleBookSelection(bookWithoutAuthor);
        const state = selectedBooksSlice.reducer(initialState, action);

        expect(state.selectedBooks[0].author).toBe('Unknown author');
      });

      it('should handle book without publish year', () => {
        const bookWithoutYear: Book = {
          ...mockBook,
          first_publish_year: undefined,
        };

        const action = selectedBooksSlice.actions.toggleBookSelection(bookWithoutYear);
        const state = selectedBooksSlice.reducer(initialState, action);

        expect(state.selectedBooks[0].firstPublishYear).toBeUndefined();
      });
    });

    describe('clearSelectedBooks', () => {
      it('should clear all selected books', () => {
        const existingState = {
          selectedBooks: [
            {
              id: '123W',
              title: 'Test Book',
              author: 'Author One',
              firstPublishYear: 2000,
            },
          ],
        };

        const action = selectedBooksSlice.actions.clearSelectedBooks();
        const state = selectedBooksSlice.reducer(existingState, action);

        expect(state.selectedBooks).toHaveLength(0);
      });
    });
  });

  describe('selectors', () => {
    it('selectSelectedBooks should return selected books', () => {
      const mockState = {
        selectedBooks: {
          selectedBooks: [
            {
              id: '123W',
              title: 'Test Book',
              author: 'Author One',
              firstPublishYear: 2000,
            },
          ],
        },
      };

      const result = selectSelectedBooks(mockState);
      expect(result).toEqual(mockState.selectedBooks.selectedBooks);
    });
  });
});
