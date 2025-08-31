import { useState, useMemo, memo } from 'react';
import Button from './Button';
import { COLUMN_LABELS } from '../types/dataTypes';

type Props = {
  allColumns: string[];
  selectedColumns: string[];
  onClose: () => void;
  onSave: (columns: string[]) => void;
};

function ColumnSelectorModal({ allColumns, selectedColumns, onClose, onSave }: Props) {
  const [localSelectedColumns, setLocalSelectedColumns] = useState<string[]>(selectedColumns);

  const toggleColumn = (columnName: string) => {
    setLocalSelectedColumns((previousSelection) =>
      previousSelection.includes(columnName)
        ? previousSelection.filter((selectedColumn) => selectedColumn !== columnName)
        : [...previousSelection, columnName],
    );
  };

  const sortedColumns = useMemo(() => allColumns.slice().sort(), [allColumns]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50" role="dialog" aria-modal="true">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-gray-300 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Columns</h3>

          <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-2">
            <div className="flex flex-col gap-1">
              {sortedColumns.map((columnName) => (
                <label
                  key={columnName}
                  className="flex cursor-pointer items-center gap-3 rounded p-2 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                    checked={localSelectedColumns.includes(columnName)}
                    onChange={() => {
                      toggleColumn(columnName);
                    }}
                  />
                  <span className="text-sm">{COLUMN_LABELS[columnName] || columnName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                onSave(localSelectedColumns);
                onClose();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ColumnSelectorModal);
