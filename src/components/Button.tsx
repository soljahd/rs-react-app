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
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  error: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
};

const activeColorClasses: Record<ButtonColor, string> = {
  primary: 'active:bg-blue-800 active:shadow-inner',
  secondary: 'active:bg-gray-800 active:shadow-inner',
  error: 'active:bg-red-800 active:shadow-inner',
  success: 'active:bg-green-800 active:shadow-inner',
  ghost: 'active:bg-gray-300 active:shadow-inner',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
};

const ringClasses: Record<ButtonColor, string> = {
  primary: 'ring-blue-500',
  secondary: 'ring-gray-500',
  error: 'ring-red-500',
  success: 'ring-green-500',
  ghost: 'ring-gray-400',
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
