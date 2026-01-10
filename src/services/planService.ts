// src/services/planService.ts
// Plan management service for Pustakam

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { PlanType, PLAN_CONFIG, isPlanActive, canCreateBook, getBooksRemaining } from '../types/plan';

// ============================================================================
// Types
// ============================================================================

export interface PlanStatus {
    plan: PlanType;
    planName: string;
    isActive: boolean;
    expiresAt: Date | null;
    booksCreated: number;
    booksRemaining: number;
    canCreate: boolean;
}

// ============================================================================
// Plan Service
// ============================================================================

export const planService = {
    /**
     * Get current plan status for the authenticated user
     */
    async getPlanStatus(): Promise<PlanStatus> {
        // Default free status for unauthenticated or non-Supabase users
        const defaultStatus: PlanStatus = {
            plan: 'free',
            planName: 'Free',
            isActive: true,
            expiresAt: null,
            booksCreated: 0,
            booksRemaining: PLAN_CONFIG.free.maxBooks,
            canCreate: true,
        };

        if (!supabase || !isSupabaseConfigured()) {
            // Without Supabase, allow unlimited books (local-only mode)
            return { ...defaultStatus, booksRemaining: Infinity, canCreate: true };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return defaultStatus;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('plan, plan_expires_at, books_created')
            .eq('id', user.id)
            .single();

        if (error || !data) {
            console.warn('Could not fetch plan status:', error);
            return defaultStatus;
        }

        const plan = (data.plan as PlanType) || 'free';
        const expiresAt = data.plan_expires_at;
        const booksCreated = data.books_created || 0;
        const active = isPlanActive(plan, expiresAt);

        // If paid plan expired, treat as free
        const effectivePlan = active ? plan : 'free';

        return {
            plan: effectivePlan,
            planName: PLAN_CONFIG[effectivePlan].name,
            isActive: active,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            booksCreated,
            booksRemaining: getBooksRemaining(effectivePlan, booksCreated),
            canCreate: canCreateBook(effectivePlan, booksCreated, expiresAt),
        };
    },

    /**
     * Increment books created count after successful book creation
     */
    async incrementBooksCreated(): Promise<boolean> {
        if (!supabase || !isSupabaseConfigured()) {
            return true; // Allow in local mode
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase.rpc('increment_books_created', {
            p_user_id: user.id,
        });

        if (error) {
            // Fallback: try direct update
            const { data: profile } = await supabase
                .from('profiles')
                .select('books_created')
                .eq('id', user.id)
                .single();

            if (profile) {
                await supabase
                    .from('profiles')
                    .update({ books_created: (profile.books_created || 0) + 1 })
                    .eq('id', user.id);
            }
        }

        return true;
    },

    /**
     * Check if user can create a book
     */
    async checkCanCreateBook(): Promise<{ allowed: boolean; message?: string }> {
        const status = await this.getPlanStatus();

        if (status.canCreate) {
            return { allowed: true };
        }

        if (status.plan === 'free') {
            return {
                allowed: false,
                message: `You've reached the free limit of ${PLAN_CONFIG.free.maxBooks} books. Upgrade to a paid plan for unlimited book generation!`,
            };
        }

        if (!status.isActive) {
            return {
                allowed: false,
                message: 'Your plan has expired. Please renew to continue creating books.',
            };
        }

        return {
            allowed: false,
            message: 'Unable to create book. Please contact support.',
        };
    },
};

export default planService;
