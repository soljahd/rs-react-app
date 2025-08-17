'use client';

import { createContext } from 'react';
import { BookDetails } from '@/types';

export type BookDetailsContextType = {
  bookDetails: BookDetails | undefined;
  loading: boolean;
  bookId: string | null;
  onClose: () => void;
  onRefresh: () => void;
};

export const BookDetailsContext = createContext<BookDetailsContextType | null>(null);
