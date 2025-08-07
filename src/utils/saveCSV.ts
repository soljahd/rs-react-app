import type { SelectedBook } from '../store/booksSlice';

function generateCSVDownloadUrl(items: SelectedBook[]) {
  const headers = ['Title', 'Author', 'First Published'];
  const rows = items.map((item) => [
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.author.replace(/"/g, '""')}"`,
    item.firstPublishYear || 'Unknown',
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const itemCount = items.length;
  const filename = `${itemCount.toString()}_item${itemCount !== 1 ? 's' : ''}.csv`;

  return { url, filename };
}

export default generateCSVDownloadUrl;
