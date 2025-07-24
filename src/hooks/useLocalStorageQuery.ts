import { useState, useEffect } from 'react';

export const useLocalStorageQuery = (key: string) => {
  const initialValue = '';

  const [query, setQuery] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, query);
  }, [key, query]);

  return [query, setQuery] as const;
};
