// src/utils/rateLimiter.ts
// Rate limiting utilities with UI feedback for Pustakam

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface RateLimitState {
    isLimited: boolean;
    retryAfter: number; // seconds remaining
    provider: string | null;
    message: string | null;
}

export interface RateLimitInfo {
    provider: string;
    model: string;
    retryAfter: number; // seconds
    hitAt: Date;
}

// ============================================================================
// Rate Limiter Class
// ============================================================================

class RateLimiter {
    private limits: Map<string, RateLimitInfo> = new Map();
    private requestCounts: Map<string, number[]> = new Map();
    private readonly maxRequestsPerMinute: Record<string, number> = {
        google: 15,
        mistral: 10,
        groq: 30,
        cerebras: 20,
        default: 10,
    };

    /**
     * Check if we can make a request to a provider
     */
    canMakeRequest(provider: string): boolean {
        // Check if we're in a rate limit cooldown
        const limit = this.limits.get(provider);
        if (limit) {
            const elapsed = (Date.now() - limit.hitAt.getTime()) / 1000;
            if (elapsed < limit.retryAfter) {
                return false;
            }
            // Cooldown expired, remove the limit
            this.limits.delete(provider);
        }

        // Check request count for client-side throttling
        return this.checkRequestCount(provider);
    }

    /**
     * Client-side request throttling
     */
    private checkRequestCount(provider: string): boolean {
        const now = Date.now();
        const windowMs = 60000; // 1 minute window
        const maxRequests = this.maxRequestsPerMinute[provider] || this.maxRequestsPerMinute.default;

        let requests = this.requestCounts.get(provider) || [];

        // Remove requests outside the window
        requests = requests.filter((time) => now - time < windowMs);

        if (requests.length >= maxRequests) {
            return false;
        }

        // Record this request
        requests.push(now);
        this.requestCounts.set(provider, requests);
        return true;
    }

    /**
     * Record a rate limit hit from the API
     */
    recordRateLimit(provider: string, model: string, retryAfter: number = 60): void {
        this.limits.set(provider, {
            provider,
            model,
            retryAfter,
            hitAt: new Date(),
        });
    }

    /**
     * Get remaining cooldown time for a provider
     */
    getRemainingCooldown(provider: string): number {
        const limit = this.limits.get(provider);
        if (!limit) return 0;

        const elapsed = (Date.now() - limit.hitAt.getTime()) / 1000;
        const remaining = Math.max(0, limit.retryAfter - elapsed);

        if (remaining === 0) {
            this.limits.delete(provider);
        }

        return Math.ceil(remaining);
    }

    /**
     * Get rate limit info for a provider
     */
    getRateLimitInfo(provider: string): RateLimitInfo | null {
        return this.limits.get(provider) || null;
    }

    /**
     * Clear rate limit for a provider (e.g., after successful request)
     */
    clearRateLimit(provider: string): void {
        this.limits.delete(provider);
    }

    /**
     * Clear all rate limits
     */
    clearAllLimits(): void {
        this.limits.clear();
        this.requestCounts.clear();
    }

    /**
     * Get user-friendly rate limit message
     */
    getRateLimitMessage(provider: string): string {
        const remaining = this.getRemainingCooldown(provider);
        if (remaining === 0) return '';

        const minutes = Math.ceil(remaining / 60);
        const seconds = remaining % 60;

        if (minutes > 1) {
            return `Rate limit active for ${provider}. Please wait ${minutes} more minute(s).`;
        } else if (remaining > 60) {
            return `Rate limit active for ${provider}. Please wait 1 minute.`;
        } else {
            return `Rate limit active for ${provider}. Please wait ${seconds} more second(s).`;
        }
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// ============================================================================
// React Hook for Rate Limit UI
// ============================================================================

export function useRateLimitState(provider: string | null): RateLimitState {
    const [state, setState] = useState<RateLimitState>({
        isLimited: false,
        retryAfter: 0,
        provider: null,
        message: null,
    });

    useEffect(() => {
        if (!provider) {
            setState({
                isLimited: false,
                retryAfter: 0,
                provider: null,
                message: null,
            });
            return;
        }

        const updateState = () => {
            const remaining = rateLimiter.getRemainingCooldown(provider);
            const isLimited = remaining > 0;

            setState({
                isLimited,
                retryAfter: remaining,
                provider: isLimited ? provider : null,
                message: isLimited ? rateLimiter.getRateLimitMessage(provider) : null,
            });
        };

        // Initial update
        updateState();

        // Update every second while rate limited
        const interval = setInterval(updateState, 1000);

        return () => clearInterval(interval);
    }, [provider]);

    return state;
}

/**
 * Hook to handle rate limit with countdown and callback
 */
export function useRateLimitCountdown(
    initialSeconds: number,
    onComplete?: () => void
): {
    seconds: number;
    isActive: boolean;
    start: (seconds: number) => void;
    stop: () => void;
    formattedTime: string;
} {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(initialSeconds > 0);

    useEffect(() => {
        if (!isActive || seconds <= 0) {
            if (isActive && seconds <= 0) {
                setIsActive(false);
                onComplete?.();
            }
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, seconds, onComplete]);

    const start = useCallback((newSeconds: number) => {
        setSeconds(newSeconds);
        setIsActive(true);
    }, []);

    const stop = useCallback(() => {
        setIsActive(false);
        setSeconds(0);
    }, []);

    const formattedTime = (() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return `${secs}s`;
    })();

    return { seconds, isActive, start, stop, formattedTime };
}

// ============================================================================
// Rate Limit UI Component Props
// ============================================================================

export interface RateLimitBannerProps {
    provider: string;
    retryAfter: number;
    onDismiss?: () => void;
    onSwitchModel?: () => void;
}

export interface RateLimitButtonProps {
    provider: string;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export default rateLimiter;
