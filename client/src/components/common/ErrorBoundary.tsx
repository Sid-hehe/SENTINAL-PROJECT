import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sentinel UI Error Boundary Caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#0B0D10] border border-red-900/60 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-600 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white">Application Exception Intercepted</h2>

            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Sentinel encountered a transient rendering exception. The system status remains protected.
            </p>

            {this.state.error && (
              <div className="p-3 rounded bg-red-950/30 border border-red-900/40 text-[11px] text-red-300 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-glow-red inline-flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Sentinel Command Center</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
