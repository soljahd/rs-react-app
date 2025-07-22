import Spinner from './Spinner';
import type { ReactNode, MouseEvent } from 'react';

type ButtonColor = 'primary' | 'secondary' | 'error' | 'success';
type ButtonType = 'button' | 'submit' | 'reset';

type ButtonProps = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  color?: ButtonColor;
};

const colorClasses: Record<ButtonColor, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-600',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white active:bg-gray-600',
  error: 'bg-red-600 hover:bg-red-700 text-white active:bg-red-600',
  success: 'bg-green-600 hover:bg-green-700 text-white active:bg-green-600',
};

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  color = 'primary',
}: ButtonProps) {
  const buttonClasses = [
    'max-w-32 min-w-24',
    'py-2 px-4',
    'font-medium',
    'rounded-lg',
    'transition-colors',
    'focus:outline-none',
    disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
    colorClasses[color],
  ].join(' ');

  return (
    <button aria-busy={loading} type={type} onClick={onClick} disabled={disabled || loading} className={buttonClasses}>
      {loading ? <Spinner /> : children}
    </button>
  );
}

export default Button;
