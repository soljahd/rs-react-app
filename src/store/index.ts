import { configureStore } from '@reduxjs/toolkit';
import selectedBooksReducer from './booksSlice';

export const store = configureStore({
  reducer: {
    selectedBooks: selectedBooksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
