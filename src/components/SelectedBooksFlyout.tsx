import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import { selectSelectedBooks, clearSelectedBooks } from '../store/booksSlice';

function SelectedBooksFlyout() {
  const dispatch = useDispatch();
  const selectedBooks = useSelector(selectSelectedBooks);

  if (selectedBooks.length === 0) {
    return null;
  }

  const handleClearSelection = () => {
    dispatch(clearSelectedBooks());
  };

  const handleDownload = () => {
    console.log('Downloading:', selectedBooks);
  };

  return (
    <div className="fixed right-4 bottom-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <span>{selectedBooks.length} books selected</span>
        <Button color="secondary" onClick={handleClearSelection}>
          Clear selection
        </Button>
        <Button onClick={handleDownload}>Download</Button>
      </div>
    </div>
  );
}

export default SelectedBooksFlyout;
