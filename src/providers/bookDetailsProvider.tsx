import { ReactNode } from 'react';
import { BookDetailsContext, BookDetailsContextType } from '../context/bookDetailsContext';

interface BookDetailsProviderProps {
  children: ReactNode;
  value: BookDetailsContextType;
}

export function BookDetailsProvider({ children, value }: BookDetailsProviderProps) {
  return <BookDetailsContext.Provider value={value}>{children}</BookDetailsContext.Provider>;
}
