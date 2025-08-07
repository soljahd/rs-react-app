import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import { selectSelectedBooks, clearSelectedBooks } from '../store/booksSlice';
import generateCSVDownloadUrl from '../utils/saveCSV';

function SelectedBooksFlyout() {
  const dispatch = useDispatch();
  const selectedBooks = useSelector(selectSelectedBooks);

  if (selectedBooks.length === 0) {
    return null;
  }

  const handleClearSelection = () => {
    dispatch(clearSelectedBooks());
  };

  const { url, filename } = generateCSVDownloadUrl(selectedBooks);

  return (
    <div className="fixed right-4 bottom-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700/50">
      <div className="flex items-center gap-4">
        <span className="dark:text-gray-200">
          {selectedBooks.length} book{selectedBooks.length !== 1 ? 's' : ''} selected
        </span>
        <Button color="secondary" onClick={handleClearSelection}>
          Unselect all
        </Button>
        <a href={url} download={filename}>
          <Button>Download</Button>
        </a>
      </div>
    </div>
  );
}

export default SelectedBooksFlyout;
