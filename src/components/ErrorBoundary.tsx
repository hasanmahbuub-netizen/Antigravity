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
                        <div className="w-20 h-20 mx-auto rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
                            <span className="text-4xl">⚠️</span>
                        </div>

                        {/* Message */}
                        <div>
                            <h2 className="text-xl font-serif font-medium text-foreground mb-2">
                                A Momentary Pause
                            </h2>
                            <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                                The app encountered an unexpected situation. We&apos;ve noted it and you can try refreshing.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3.5 px-6 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/10 hover:bg-primary/90 active:scale-[0.98] transition-all"
                                aria-label="Refresh the page"
                            >
                                Reload Application
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full py-3.5 px-6 bg-muted/5 text-muted-foreground rounded-xl font-medium hover:bg-muted/10 transition-colors"
                                aria-label="Go back to previous page"
                            >
                                Go Back
                            </button>
                        </div>

                        {/* Error details (dev only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-8 text-left p-4 bg-muted/5 rounded-xl border border-border/50">
                                <summary className="text-[10px] uppercase tracking-widest text-muted cursor-pointer hover:text-foreground transition-colors">
                                    Debug Information
                                </summary>
                                <pre className="mt-3 text-[10px] text-red-400 overflow-auto whitespace-pre-wrap font-mono">
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
