/**
 * Simple in-memory rate limiter for API routes
 * 
 * For production at scale, use Redis-based solution like @upstash/ratelimit
 * This is a lightweight solution for moderate traffic
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((entry, key) => {
        if (entry.resetTime < now) {
            rateLimitMap.delete(key);
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number;      // Max requests allowed
    windowMs: number;         // Time window in milliseconds
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetInMs: number;
}

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 20, windowMs: 60 * 1000 }
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    // First request or window expired
    if (!entry || entry.resetTime < now) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs
        });
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetInMs: config.windowMs
        };
    }

    // Within window
    if (entry.count < config.maxRequests) {
        entry.count++;
        return {
            success: true,
            remaining: config.maxRequests - entry.count,
            resetInMs: entry.resetTime - now
        };
    }

    // Rate limited
    return {
        success: false,
        remaining: 0,
        resetInMs: entry.resetTime - now
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Sanitize user input to prevent prompt injection
 * Removes potentially dangerous patterns from AI prompts
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    return input
        // Trim whitespace
        .trim()
        // Limit length
        .slice(0, maxLength)
        // Remove control characters
        .replace(/[\x00-\x1F\x7F]/g, '')
        // Remove potential instruction injection patterns
        .replace(/ignore\s+(all\s+)?previous\s+instructions?/gi, '[FILTERED]')
        .replace(/you\s+are\s+now\s+a?/gi, '[FILTERED]')
        .replace(/system\s*:/gi, '[FILTERED]')
        .replace(/assistant\s*:/gi, '[FILTERED]')
        .replace(/user\s*:/gi, '[FILTERED]')
        // Remove markdown/code blocks that might confuse the model
        .replace(/```[\s\S]*?```/g, '[CODE REMOVED]')
        // Remove excessive whitespace
        .replace(/\s+/g, ' ');
}

/**
 * Validate that a string is safe for use in prompts
 */
export function isValidQuestion(question: string): { valid: boolean; error?: string } {
    if (!question || typeof question !== 'string') {
        return { valid: false, error: 'Question is required' };
    }

    const trimmed = question.trim();

    if (trimmed.length < 3) {
        return { valid: false, error: 'Question is too short' };
    }

    if (trimmed.length > 1000) {
        return { valid: false, error: 'Question is too long (max 1000 characters)' };
    }

    // Check for obviously malicious patterns
    const suspiciousPatterns = [
        /ignore\s+(all\s+)?previous/i,
        /you\s+are\s+now/i,
        /pretend\s+to\s+be/i,
        /act\s+as\s+if/i,
        /forget\s+(all\s+)?your\s+instructions/i,
    ];

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(trimmed)) {
            return { valid: false, error: 'Invalid question format' };
        }
    }

    return { valid: true };
}
