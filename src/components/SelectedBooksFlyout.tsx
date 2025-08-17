import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCSVDownload } from '@/app/actions/generate-csv';
import Button from './Button';
import { selectSelectedBooks, clearSelectedBooks } from '../store/booksSlice';

function SelectedBooksFlyout() {
  const t = useTranslations('SelectedBooksFlyout');
  const dispatch = useDispatch();
  const selectedBooks = useSelector(selectSelectedBooks);
  const [isLoading, setIsLoading] = useState(false);

  if (selectedBooks.length === 0) {
    return null;
  }

  const handleClearSelection = () => {
    dispatch(clearSelectedBooks());
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const { csvContent, filename } = await generateCSVDownload(selectedBooks);

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate CSV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700/50">
      <div className="flex items-center gap-4">
        <span className="dark:text-gray-200">{t('selectedBooks', { count: selectedBooks.length })}</span>
        <Button color="secondary" onClick={handleClearSelection}>
          {t('unselectAll')}
        </Button>
        <Button onClick={() => void handleDownload()} disabled={isLoading}>
          {isLoading ? t('generating') : t('download')}
        </Button>
      </div>
    </div>
  );
}

export default SelectedBooksFlyout;
