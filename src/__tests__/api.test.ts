import axios from 'axios';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { searchBooks, getBookDetails } from '../api/api';
import type { SearchBooksResponse, Book, BookDetails } from '../api/api';
import type { Mock } from 'vitest';

type MockedAxiosInstance = {
  get: ReturnType<typeof vi.fn>;
  interceptors: {
    request: { use: Mock; eject: Mock };
    response: { use: Mock; eject: Mock };
  };
};

vi.mock('axios', () => {
  const mockAxiosInstance: MockedAxiosInstance = {
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

const mockApiInstance = (axios.create as ReturnType<typeof vi.fn>)() as MockedAxiosInstance;

describe('searchBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return books data on successful request', async () => {
    const mockResponse: SearchBooksResponse = {
      docs: [
        {
          key: '/works/OL1W',
          title: 'Test Book',
          author_name: ['Test Author'],
          first_publish_year: 2023,
        },
      ],
      numFound: 1,
      offset: 0,
      q: 'test',
    };

    mockApiInstance.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await searchBooks('test');

    expect(result).toEqual(mockResponse);
    expect(mockApiInstance.get).toHaveBeenCalledWith('/search.json', {
      params: {
        q: 'test',
        offset: 0,
        limit: 10,
      },
    });
  });

  it('should use "popular" as default query when empty string is provided', async () => {
    const mockResponse: SearchBooksResponse = {
      docs: [],
      numFound: 0,
    };

    mockApiInstance.get.mockResolvedValueOnce({ data: mockResponse });

    await searchBooks('');

    expect(mockApiInstance.get).toHaveBeenCalledWith('/search.json', {
      params: {
        q: 'popular',
        offset: 0,
        limit: 10,
      },
    });
  });

  it('should handle error scenarios', async () => {
    const errorMessage = 'Network Error';
    mockApiInstance.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(searchBooks('test')).rejects.toThrow(errorMessage);
  });

  it('should use custom offset and limit when provided', async () => {
    const mockResponse: SearchBooksResponse = {
      docs: [],
      numFound: 0,
    };

    mockApiInstance.get.mockResolvedValueOnce({ data: mockResponse });

    await searchBooks('test', 5, 20);

    expect(mockApiInstance.get).toHaveBeenCalledWith('/search.json', {
      params: {
        q: 'test',
        offset: 5,
        limit: 20,
      },
    });
  });

  it('should return correct book data structure', async () => {
    const mockBook: Book = {
      key: '/works/OL2W',
      title: 'Another Test Book',
      author_name: ['Author 1', 'Author 2'],
      first_publish_year: 2020,
      publish_year: [2020, 2021],
      cover_i: 12345,
      edition_count: 3,
      language: ['English'],
      subject: ['Fiction', 'Science'],
      isbn: ['1234567890'],
      publisher: ['Test Publisher'],
      ratings_average: 4.5,
      ratings_count: 100,
    };

    const mockResponse: SearchBooksResponse = {
      docs: [mockBook],
      numFound: 1,
    };

    mockApiInstance.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await searchBooks('test');

    expect(result.docs[0]).toEqual(mockBook);
  });

  it('should return book details for valid book ID', async () => {
    const mockBookDetails: BookDetails = {
      key: '/works/OL1W',
      title: 'Test Book Details',
      description: 'This is a test book description',
      authors: [
        { name: 'Author One', key: '/authors/A1' },
        { name: 'Author Two', key: '/authors/A2' },
      ],
      covers: [12345, 67890],
      first_publish_date: '2020-01-01',
      subjects: ['Fiction', 'Science Fiction'],
    };

    mockApiInstance.get.mockResolvedValueOnce({ data: mockBookDetails });

    const result = await getBookDetails('1W');

    expect(result).toEqual(mockBookDetails);
    expect(mockApiInstance.get).toHaveBeenCalledWith('/works/OL1W.json');
  });
});
