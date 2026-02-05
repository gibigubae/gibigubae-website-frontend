import React from "react";
import ErrorPage from "./ErrorPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log error if needed
    // console.error("ErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="Application Error"
          message={this.state.error?.message || "Unexpected error occurred."}
          onRetry={this.handleRetry}
          retryLabel="Try Again"
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
