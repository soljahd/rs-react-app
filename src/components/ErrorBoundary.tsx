import { Component, type ErrorInfo } from 'react';

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<{ children: React.ReactNode }, State> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (!this.state.hasError) {
      console.error('Error caught:', error, errorInfo);
    }
  }

  render() {
    return this.state.hasError ? (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex max-w-md flex-col items-center gap-y-2 rounded-lg bg-white p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">Error</h2>
          <p className="text-gray-600">This is a test error from the error button</p>
          <p className="text-gray-500">Please refresh the page</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="max-w-32 min-w-24 cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 active:bg-red-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
