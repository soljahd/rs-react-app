import { configureStore } from '@reduxjs/toolkit';
import selectedBooksReducer from './booksSlice';
import { booksApi } from '../api/api';

export const store = configureStore({
  reducer: {
    selectedBooks: selectedBooksReducer,
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(booksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
