// src/types/plan.ts
// Plan types and limits for Pustakam

export type PlanType = 'free' | 'monthly' | 'yearly';

export interface PlanLimits {
    maxBooks: number; // -1 for unlimited
    name: string;
    description: string;
}

export const PLAN_CONFIG: Record<PlanType, PlanLimits> = {
    free: {
        maxBooks: 3,
        name: 'Free',
        description: '3 books to try the platform',
    },
    monthly: {
        maxBooks: -1, // unlimited
        name: 'Monthly',
        description: 'Unlimited book generation',
    },
    yearly: {
        maxBooks: -1, // unlimited
        name: 'Yearly',
        description: 'Unlimited book generation + best value',
    },
};

// Duration in days for each paid plan
export const PLAN_DURATION_DAYS: Record<Exclude<PlanType, 'free'>, number> = {
    monthly: 30,
    yearly: 365,
};

// Pricing in INR (for display only)
export const PLAN_PRICING = {
    free: 0,
    monthly: 149,
    yearly: 1299,
};

export interface PricingPlan {
    id: string;
    name: string;
    price: number | string;
    features: string[];
    popular?: boolean;
}

export const planPricing: PricingPlan[] = [
    {
        id: 'free',
        name: 'Starter',
        price: '0',
        features: ['3 Books / Month', 'Standard Generation', 'Basic Export Formats', 'Community Support'],
        popular: false
    },
    {
        id: 'pro',
        name: 'Pro Author',
        price: '29',
        features: ['Unlimited Books', 'Advanced Concept Analysis', 'Priority Generation', 'All Export Formats', 'Commercial Rights'],
        popular: true
    },
    {
        id: 'team',
        name: 'Publisher',
        price: '99',
        features: ['Everything in Pro', 'Team Collaboration', 'API Access', 'White-label Export', 'Dedicated Success Manager'],
        popular: false
    }
];

export interface UserPlan {
    plan: PlanType;
    planExpiresAt: Date | null;
    booksCreated: number;
    isActive: boolean;
}

/**
 * Check if a plan is currently active
 */
export function isPlanActive(plan: PlanType, expiresAt: string | null): boolean {
    if (plan === 'free') return true;
    if (!expiresAt) return false;
    return new Date(expiresAt) > new Date();
}

/**
 * Get remaining books for a user
 */
export function getBooksRemaining(plan: PlanType, booksCreated: number): number {
    const limits = PLAN_CONFIG[plan];
    if (limits.maxBooks === -1) return Infinity;
    return Math.max(0, limits.maxBooks - booksCreated);
}

/**
 * Check if user can create a book
 */
export function canCreateBook(plan: PlanType, booksCreated: number, expiresAt: string | null): boolean {
    // Check if plan is active
    if (!isPlanActive(plan, expiresAt)) {
        // Fallback to free tier if expired
        return booksCreated < PLAN_CONFIG.free.maxBooks;
    }

    const limits = PLAN_CONFIG[plan];
    if (limits.maxBooks === -1) return true;
    return booksCreated < limits.maxBooks;
}
