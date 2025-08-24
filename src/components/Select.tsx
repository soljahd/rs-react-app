import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  id: string;
  options: { label: string; value: string }[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, id, options, className, ...rest }, ref) => {
  const selectClasses = [
    'w-full rounded-lg border bg-gray-50 p-2',
    'focus:outline-none dark:bg-gray-700 dark:text-white',
    error
      ? 'border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500'
      : 'border-gray-300 focus:border-blue-700 dark:border-gray-600 dark:focus:border-blue-500',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <select id={id} ref={ref} className={selectClasses} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="h-5">{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}</div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
