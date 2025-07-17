import { Component } from 'react';
import Spinner from './Spinner';
import type { ReactNode, MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'success';
};

class Button extends Component<Props> {
  getButtonClasses(): string {
    const { color = 'primary', disabled, loading } = this.props;

    const classes = [
      'max-w-32 min-w-24',
      'py-2 px-4',
      'font-medium',
      'rounded-lg',
      'transition-colors',
      'focus:outline-none',
      disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
    ];

    const colorClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-600',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white active:bg-gray-600',
      error: 'bg-red-600 hover:bg-red-700 text-white active:bg-red-600',
      success: 'bg-green-600 hover:bg-green-700 text-white active:bg-green-600',
    };

    const selectedColor = colorClasses[color];
    classes.push(selectedColor);

    return classes.join(' ').trim();
  }

  render() {
    const { children, onClick, type = 'button', disabled = false, loading = false } = this.props;

    return (
      <button
        aria-busy={loading}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={this.getButtonClasses()}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }
}

export default Button;
