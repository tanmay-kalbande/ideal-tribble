// src/services/creditService.ts
// Credit management service for Kitaab-AI

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// ============================================================================
// Types
// ============================================================================

export interface CreditTransaction {
    id: string;
    amount: number;
    reason: string;
    payment_reference: string | null;
    book_id: string | null;
    created_at: string;
}

export interface UseCreditResult {
    success: boolean;
    error?: string;
    remainingCredits?: number;
}

// ============================================================================
// Credit Service
// ============================================================================

export const creditService = {
    /**
     * Get current credit balance for the authenticated user
     */
    async getCredits(): Promise<number> {
        if (!supabase || !isSupabaseConfigured()) {
            console.warn('Supabase not configured, returning 0 credits');
            return 0;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching credits:', error);
            return 0;
        }

        return data?.credits ?? 0;
    },

    /**
     * Check if user has an active paid plan (monthly or yearly)
     * Users with paid plans have unlimited books (no credit deduction)
     */
    async hasPaidPlan(): Promise<boolean> {
        if (!supabase || !isSupabaseConfigured()) {
            return false;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('profiles')
            .select('plan, plan_expires_at')
            .eq('id', user.id)
            .single();

        if (error || !data) return false;

        // Check if plan is monthly or yearly AND not expired
        if (data.plan === 'monthly' || data.plan === 'yearly') {
            // If plan_expires_at is null or in the future, plan is active
            if (!data.plan_expires_at) return true;
            return new Date(data.plan_expires_at) > new Date();
        }

        return false;
    },

    /**
     * Start book generation securely via server-side RPC
     * The server handles credit deduction and plan verification atomically
     */
    async useCredit(bookId: string, title: string, goal: string): Promise<UseCreditResult> {
        if (!supabase || !isSupabaseConfigured()) {
            return { success: false, error: 'Authentication not configured' };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Call the secure RPC function
        // This handles:
        // 1. Checking if user has valid paid plan
        // 2. OR checking if user has credits
        // 3. Deducting credit if needed
        // 4. Logging the transaction
        // 5. Creating the book_generation record
        const { data, error } = await supabase
            .rpc('start_book_generation', {
                p_book_id: bookId,
                p_title: title,
                p_goal: goal,
            });

        if (error) {
            console.error('Error starting generation:', error);
            // Handle specific database errors with user-friendly messages
            if (error.message.includes('Insufficient credits')) {
                return { success: false, error: 'Insufficient credits' };
            }
            return { success: false, error: error.message };
        }

        if (!data || !data.success) {
            return {
                success: false,
                error: data?.error || 'Failed to start generation'
            };
        }

        return {
            success: true,
            remainingCredits: data.remainingCredits
        };
    },

    /**
     * Get transaction history for the authenticated user
     */
    async getTransactionHistory(): Promise<CreditTransaction[]> {
        if (!supabase || !isSupabaseConfigured()) {
            return [];
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }

        return data as CreditTransaction[];
    },

    /**
     * Update book generation status
     */
    async updateBookStatus(
        bookId: string,
        status: 'generating' | 'completed' | 'failed',
        wordCount?: number
    ): Promise<void> {
        if (!supabase || !isSupabaseConfigured()) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const updates: Record<string, any> = { status };

        if (status === 'completed') {
            updates.completed_at = new Date().toISOString();
            if (wordCount !== undefined) {
                updates.word_count = wordCount;
            }
        }

        await supabase
            .from('book_generations')
            .update(updates)
            .eq('book_id', bookId)
            .eq('user_id', user.id);
    },

    /**
     * Check if user has enough credits
     */
    async hasCredits(required: number = 1): Promise<boolean> {
        const credits = await this.getCredits();
        return credits >= required;
    },
};

export default creditService;
