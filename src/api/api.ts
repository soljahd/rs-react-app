import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publish_year?: number[];
  cover_i?: number;
  edition_count?: number;
  language?: string[];
  subject?: string[];
  isbn?: string[];
  publisher?: string[];
  ratings_average?: number;
  ratings_count?: number;
};

export type SearchBooksResponse = {
  docs: Book[];
  numFound: number;
  offset?: number;
  q?: string;
};

export const searchBooks = async (
  query: string,
  offset: number = 0,
  limit: number = 10,
): Promise<SearchBooksResponse> => {
  if (query === '') query = 'popular';
  const response = await api.get<SearchBooksResponse>('/search.json', {
    params: {
      q: query,
      offset,
      limit,
    },
  });
  return response.data;
};
