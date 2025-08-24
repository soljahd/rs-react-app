import { useId, useState, forwardRef } from 'react';

type AutocompleteProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  id: string;
  options: string[];
  filterOptions?: (query: string, options: string[]) => string[];
};

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ label, value, onChange, error, id, options, filterOptions = defaultFilter }, ref) => {
    const listId = useId();
    const [open, setOpen] = useState(false);

    const items = filterOptions(value, options);

    const inputClasses = [
      'w-full rounded-lg border bg-gray-50 p-2',
      'focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
      error
        ? 'border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500'
        : 'border-gray-300 focus:border-blue-700 dark:border-gray-600 dark:focus:border-blue-500',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        className="flex flex-col gap-1"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setOpen(false);
          }
        }}
      >
        <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>

        <input
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
          }}
          autoComplete="off"
          className={inputClasses}
          aria-controls={listId}
          aria-expanded={open}
          role="combobox"
        />

        <div className="h-5">{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}</div>

        {open && items.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="max-h-48 overflow-auto rounded-lg border border-gray-300 bg-white shadow dark:border-gray-600 dark:bg-gray-700"
          >
            {items.map((it) => (
              <li
                key={it}
                role="option"
                tabIndex={0}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(it);
                  setOpen(false);
                }}
              >
                {it}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';

function defaultFilter(query: string, options: string[]): string[] {
  if (!query.trim()) return options;
  return options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
}

export default Autocomplete;
