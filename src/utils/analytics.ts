// src/utils/analytics.ts
// Analytics and telemetry tracking utilities for Pustakam

import { track } from '@vercel/analytics';

// ============================================================================
// Types
// ============================================================================

export interface BookGenerationEvent {
    provider: string;
    model: string;
    moduleCount: number;
    goal?: string;
}

export interface BookCompletionEvent {
    provider: string;
    model: string;
    duration: number; // milliseconds
    wordCount: number;
    moduleCount: number;
    success: boolean;
}

export interface ErrorEvent {
    code: string;
    message: string;
    provider?: string;
    model?: string;
    context?: string;
}

// ============================================================================
// Analytics Service
// ============================================================================

export const analytics = {
    /**
     * Track book generation started
     */
    trackGenerationStarted(event: BookGenerationEvent): void {
        try {
            track('book_generation_started', {
                provider: event.provider,
                model: event.model,
                module_count: event.moduleCount,
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track generation started:', error);
        }
    },

    /**
     * Track book generation completed
     */
    trackGenerationCompleted(event: BookCompletionEvent): void {
        try {
            track('book_generation_completed', {
                provider: event.provider,
                model: event.model,
                duration_seconds: Math.round(event.duration / 1000),
                word_count: event.wordCount,
                module_count: event.moduleCount,
                success: event.success,
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track generation completed:', error);
        }
    },

    /**
     * Track roadmap generation
     */
    trackRoadmapGenerated(event: { provider: string; model: string; moduleCount: number }): void {
        try {
            track('roadmap_generated', {
                provider: event.provider,
                model: event.model,
                module_count: event.moduleCount,
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track roadmap generated:', error);
        }
    },

    /**
     * Track errors with context
     */
    trackError(event: ErrorEvent): void {
        try {
            track('error_occurred', {
                error_code: event.code,
                error_message: event.message.slice(0, 100), // Limit message length
                provider: event.provider || 'unknown',
                model: event.model || 'unknown',
                context: event.context || 'general',
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track error:', error);
        }
    },

    /**
     * Track rate limit hit
     */
    trackRateLimitHit(event: { provider: string; model: string; retryCount: number }): void {
        try {
            track('rate_limit_hit', {
                provider: event.provider,
                model: event.model,
                retry_count: event.retryCount,
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track rate limit:', error);
        }
    },

    /**
     * Track user action
     */
    trackAction(action: string, properties?: Record<string, string | number | boolean>): void {
        try {
            track(action, properties);
        } catch (error) {
            console.warn('[Analytics] Failed to track action:', error);
        }
    },

    /**
     * Track PDF download
     */
    trackDownload(format: 'pdf' | 'markdown', wordCount: number): void {
        try {
            track('book_downloaded', {
                format,
                word_count: wordCount,
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track download:', error);
        }
    },

    /**
     * Track reading session
     */
    trackReadingSession(event: { bookId: string; duration: number; percentComplete: number }): void {
        try {
            track('reading_session', {
                duration_seconds: Math.round(event.duration / 1000),
                percent_complete: Math.round(event.percentComplete),
            });
        } catch (error) {
            console.warn('[Analytics] Failed to track reading session:', error);
        }
    },
};

export default analytics;
