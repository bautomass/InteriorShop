import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-8 text-center">
          <h2 className="text-lg font-bold text-red-600">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-500">{this.state.error?.message}</p>
          <button
            className="mt-4 rounded-xl bg-accent-500 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-accent-600"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 