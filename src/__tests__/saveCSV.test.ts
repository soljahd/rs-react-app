import { saveAs } from 'file-saver';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import downloadItemsAsCSV from '../utils/saveCSV';
import type { SelectedBook } from '../store/booksSlice';
import type { MockedFunction } from 'vitest';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

const mockedSaveAs = saveAs as MockedFunction<typeof saveAs>;

async function getBlobText(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsText(blob);
  });
}

describe('downloadItemsAsCSV', () => {
  const mockBooks: SelectedBook[] = [
    {
      id: '1',
      title: 'Test Book 1',
      author: 'Author One',
      firstPublishYear: 2000,
    },
    {
      id: '2',
      title: 'Test Book 2',
      author: 'Author Two',
      firstPublishYear: undefined,
    },
    {
      id: '3',
      title: 'Book with "quotes"',
      author: 'Author "Three"',
      firstPublishYear: 1995,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate correct CSV content', async () => {
    downloadItemsAsCSV(mockBooks);

    const blob: unknown = mockedSaveAs.mock.calls[0][0];
    const csvContent = await getBlobText(blob as Blob);
    const csvLines = csvContent.split('\n');

    const expectedHeaders = 'Title,Author,First Published';
    const expectedRow1 = '"Test Book 1","Author One",2000';
    const expectedRow2 = '"Test Book 2","Author Two",Unknown';
    const expectedRow3 = '"Book with ""quotes""","Author ""Three""",1995';

    expect(csvLines[0]).toBe(expectedHeaders);
    expect(csvLines[1]).toBe(expectedRow1);
    expect(csvLines[2]).toBe(expectedRow2);
    expect(csvLines[3]).toBe(expectedRow3);
  });

  it('should generate correct filename for single item', () => {
    downloadItemsAsCSV([mockBooks[0]]);
    expect(saveAs).toHaveBeenCalledWith(expect.anything(), '1_item.csv');
  });

  it('should generate correct filename for multiple items', () => {
    downloadItemsAsCSV(mockBooks);
    expect(saveAs).toHaveBeenCalledWith(expect.anything(), '3_items.csv');
  });

  it('should handle empty array', () => {
    downloadItemsAsCSV([]);
    expect(saveAs).toHaveBeenCalledWith(expect.anything(), '0_items.csv');
  });

  it('should escape quotes in titles and authors', async () => {
    const bookWithQuotes = mockBooks[2];
    downloadItemsAsCSV([bookWithQuotes]);

    const blob = mockedSaveAs.mock.calls[0][0];
    const csvContent = await getBlobText(blob as Blob);
    const csvLines = csvContent.split('\n');

    expect(csvLines[1]).toContain('""quotes""');
    expect(csvLines[1]).toContain('""Three""');
  });

  it('should handle undefined publish year', async () => {
    const bookWithoutYear = mockBooks[1];
    downloadItemsAsCSV([bookWithoutYear]);

    const blob = mockedSaveAs.mock.calls[0][0];
    const csvContent = await getBlobText(blob as Blob);
    const csvLines = csvContent.split('\n');

    expect(csvLines[1]).toContain(',Unknown');
  });
});
