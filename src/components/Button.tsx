import Spinner from './Spinner';
import type { ReactNode, MouseEvent } from 'react';

type ButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'ghost';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  color?: ButtonColor;
  size?: ButtonSize;
  className?: string;
  active?: boolean;
};

const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none';

const colorClasses: Record<ButtonColor, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-500 dark:hover:bg-gray-600',
  error: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600',
  success: 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
};

const activeColorClasses: Record<ButtonColor, string> = {
  primary: 'active:bg-blue-800 active:shadow-inner dark:active:bg-blue-700',
  secondary: 'active:bg-gray-800 active:shadow-inner dark:active:bg-gray-700',
  error: 'active:bg-red-800 active:shadow-inner dark:active:bg-red-700',
  success: 'active:bg-green-800 active:shadow-inner dark:active:bg-green-700',
  ghost: 'active:bg-gray-300 active:shadow-inner dark:active:bg-gray-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
};

const ringClasses: Record<ButtonColor, string> = {
  primary: 'ring-blue-500 dark:ring-blue-400',
  secondary: 'ring-gray-500 dark:ring-gray-400',
  error: 'ring-red-500 dark:ring-red-400',
  success: 'ring-green-500 dark:ring-green-400',
  ghost: 'ring-gray-400 dark:ring-gray-500',
};

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  color = 'primary',
  size = 'md',
  className = '',
  active = false,
}: ButtonProps) {
  const isInteractive = !(disabled || loading);

  const buttonClasses = [
    baseClasses,
    isInteractive ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed',
    colorClasses[color],
    isInteractive && activeColorClasses[color],
    sizeClasses[size],
    active && `ring-2 ring-offset-2 ${ringClasses[color]}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button aria-busy={loading} type={type} onClick={onClick} disabled={disabled || loading} className={buttonClasses}>
      {loading ? <Spinner size={size} /> : children}
    </button>
  );
}

export default Button;
