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

export interface UserPlan {
    plan: PlanType;
    planExpiresAt: Date | null;
    booksCreated: number;
    isActive: boolean;
}

