import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OfflineErrorProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export function OfflineError({
    title = "Connection Lost",
    message = "We couldn't connect to the server. Please checks your internet connection and try again.",
    onRetry,
    isRetrying = false
}: OfflineErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6"
            >
                <WifiOff className="w-10 h-10 text-red-500" />
            </motion.div>

            <h3 className="text-xl font-medium text-foreground mb-2">
                {title}
            </h3>

            <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed mb-8">
                {message}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    disabled={isRetrying}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isRetrying ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Connecting...</span>
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4" />
                            <span>Try Again</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

export function GenericError({
    message = "Something went wrong. Please try again.",
    onRetry
}: { message?: string, onRetry?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-foreground font-medium mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-sm text-primary font-medium hover:underline"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
