'use server';

import type { SelectedBook } from '@/store/booksSlice';

export async function generateCSVDownload(items: SelectedBook[]) {
  await Promise.resolve();

  const headers = ['Title', 'Author', 'First Published'];
  const rows = items.map((item) => [
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.author.replace(/"/g, '""')}"`,
    item.firstPublishYear || 'Unknown',
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const itemCount = items.length;
  const filename = `${itemCount.toString()}_item${itemCount !== 1 ? 's' : ''}.csv`;

  return { csvContent, filename };
}
