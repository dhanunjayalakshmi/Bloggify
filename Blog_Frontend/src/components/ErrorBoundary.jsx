import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl font-extrabold text-orange-500">Oops!</h1>
          <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-muted-foreground max-w-sm">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            className="mt-8 px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
