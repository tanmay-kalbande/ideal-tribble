// src/components/CreditBadge.tsx
// Credit display badge matching Kitaab-AI's minimal dark theme

import React, { useState } from 'react';
import { Coins, ChevronDown, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CreditBadgeProps {
    onBuyCredits: () => void;
    onOpenAuth: () => void;
}

export function CreditBadge({ onBuyCredits, onOpenAuth }: CreditBadgeProps) {
    const { user, profile, credits, isAuthenticated, isLoading, signOut, isSupabaseEnabled } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    // Check if user has an active paid plan (monthly or yearly)
    const isPaidPlan = profile?.plan === 'monthly' || profile?.plan === 'yearly';

    // Don't show if Supabase is not configured
    if (!isSupabaseEnabled) {
        return null;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg animate-pulse">
                <div className="w-4 h-4 bg-[var(--color-border)] rounded" />
                <div className="w-8 h-3 bg-[var(--color-border)] rounded" />
            </div>
        );
    }

    // Not authenticated - show simple Sign In button
    if (!isAuthenticated) {
        return (
            <button
                onClick={onOpenAuth}
                className="btn btn-primary btn-sm"
            >
                <User size={14} />
                <span>Sign In</span>
            </button>
        );
    }

    // Authenticated with credits
    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-[var(--color-card)] border rounded-lg transition-all ${isPaidPlan
                    ? 'border-amber-500/50 hover:border-amber-500'
                    : credits === 0
                        ? 'border-red-500/50 hover:border-red-500'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'
                    }`}
            >
                <Coins size={14} className={isPaidPlan ? 'text-amber-400' : credits > 0 ? 'text-yellow-400' : 'text-red-400'} />
                <span className={`text-sm font-bold ${isPaidPlan ? 'text-amber-400' : credits > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {isPaidPlan ? 'PRO' : credits}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-[var(--color-text-secondary)] transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-sidebar)] border border-[var(--color-border)] rounded-lg shadow-2xl z-50 animate-fade-in-up overflow-hidden">
                        {/* User Info */}
                        <div className="p-3 border-b border-[var(--color-border)]">
                            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                                {profile?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] truncate">{user?.email}</p>
                        </div>

                        {/* Credit Status */}
                        <div className="p-3 border-b border-[var(--color-border)]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                                    {isPaidPlan ? 'Plan' : 'Credits'}
                                </span>
                                <span className={`font-bold ${isPaidPlan ? 'text-amber-400' : credits > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {isPaidPlan ? (profile?.plan === 'yearly' ? 'Yearly PRO' : 'Monthly PRO') : credits}
                                </span>
                            </div>
                            {isPaidPlan ? (
                                <p className="text-xs text-amber-400 mt-1">Unlimited books included!</p>
                            ) : credits === 0 ? (
                                <p className="text-xs text-red-400 mt-1">Purchase credits to generate books</p>
                            ) : null}
                        </div>

                        {/* Actions */}
                        <div className="p-1.5">
                            {/* Only show Buy Credits for free tier users */}
                            {!isPaidPlan && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            onBuyCredits();
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-[var(--color-card)] transition-colors"
                                    >
                                        <Plus size={14} className="text-amber-400" />
                                        <span className="text-[var(--color-text-primary)]">Buy Credits</span>
                                    </button>
                                    <div className="my-1 border-t border-[var(--color-border)]" />
                                </>
                            )}

                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    signOut();
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={14} className="text-red-400" />
                                <span className="text-red-400">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CreditBadge;
