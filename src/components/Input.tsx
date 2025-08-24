import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  id: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className, ...rest }, ref) => {
  const inputClasses = [
    'w-full rounded-lg border bg-gray-50 p-2',
    'focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
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
      <input id={id} ref={ref} className={inputClasses} {...rest} />
      {error && (
        <div className="h-5">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
