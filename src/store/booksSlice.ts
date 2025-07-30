import { createSlice } from '@reduxjs/toolkit';
import type { Book } from '../api/api';
import type { PayloadAction } from '@reduxjs/toolkit';

type SelectedBook = {
  id: string;
  title: string;
  author: string;
  firstPublishYear?: number;
};

type SelectedBooksState = {
  selectedBooks: SelectedBook[];
};

const initialState: SelectedBooksState = {
  selectedBooks: [],
};

export const selectedBooksSlice = createSlice({
  name: 'selectedBooks',
  initialState,
  reducers: {
    toggleBookSelection: (state, action: PayloadAction<Book>) => {
      const book = action.payload;
      const bookId = book.key.replace('/works/OL', '');
      const author = book.author_name?.join(', ') || 'Unknown author';

      const existingIndex = state.selectedBooks.findIndex((b) => b.id === bookId);

      if (existingIndex >= 0) {
        state.selectedBooks.splice(existingIndex, 1);
      } else {
        state.selectedBooks.push({
          id: bookId,
          title: book.title,
          author,
          firstPublishYear: book.first_publish_year,
        });
      }
    },
    clearSelectedBooks: (state) => {
      state.selectedBooks = [];
    },
  },
});

export const { toggleBookSelection, clearSelectedBooks } = selectedBooksSlice.actions;

export const selectSelectedBooks = (state: { selectedBooks: SelectedBooksState }) => state.selectedBooks.selectedBooks;

export default selectedBooksSlice.reducer;
