import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class DevErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-4">오류가 발생했습니다</h1>
            <pre className="bg-white p-4 rounded border overflow-auto text-sm">
              {this.state.error?.toString()}
              {"\n\n"}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}













