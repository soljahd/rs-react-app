import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '../components';

const createErrorComponent = () => {
  let shouldThrow = true;

  const ErrorComponent = () => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>Normal component state</div>;
  };

  ErrorComponent.resetError = () => {
    shouldThrow = false;
  };

  return ErrorComponent;
};

describe('ErrorBoundary Component', () => {
  it('should catch errors in child components and display fallback UI', () => {
    const ErrorComponent = createErrorComponent();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  it('should log errors to console', () => {
    const ErrorComponent = createErrorComponent();
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
  });

  it('should render children when no error occurs', () => {
    const ErrorComponent = createErrorComponent();
    ErrorComponent.resetError();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal component state')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /error/i })).not.toBeInTheDocument();
  });

  it('should reset error state when button clicked', async () => {
    const ErrorComponent = createErrorComponent();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();

    ErrorComponent.resetError();
    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Normal component state')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /error/i })).not.toBeInTheDocument();
  });
});
