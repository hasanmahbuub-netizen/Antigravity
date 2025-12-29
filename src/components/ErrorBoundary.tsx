"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them, and displays a fallback UI instead of crashing.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error to monitoring service in production
        console.error("Error Boundary caught an error:", error, errorInfo);

        // TODO: Send to error tracking service (e.g., Sentry)
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureException(error);
        // }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-6">
                    <div className="max-w-md text-center space-y-6">
                        {/* Icon */}
                        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        {/* Message */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-foreground/60 text-sm leading-relaxed">
                                We apologize for the inconvenience. Please try refreshing the page.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                aria-label="Refresh the page"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full py-3 px-6 bg-muted/10 text-foreground rounded-xl font-medium hover:bg-muted/20 transition-colors"
                                aria-label="Go back to previous page"
                            >
                                Go Back
                            </button>
                        </div>

                        {/* Error details (dev only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left p-4 bg-card rounded-xl border border-border">
                                <summary className="text-xs text-foreground/60 cursor-pointer">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs text-red-500 overflow-auto whitespace-pre-wrap">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
