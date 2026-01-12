// src/contexts/AuthContext.tsx
// Authentication context for Kitaab-AI with Supabase

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// ============================================================================
// Types
// ============================================================================

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    credits: number;
    is_admin: boolean;
    created_at: string;
    // Plan fields
    plan: 'free' | 'monthly' | 'yearly';
    plan_expires_at: string | null;
    books_created: number;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    credits: number;
    isLoading: boolean;
    isAuthenticated: boolean;
    isSupabaseEnabled: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    refreshCredits: () => Promise<void>;
    updateProfile: (data: { full_name?: string }) => Promise<{ error: Error | null }>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTimedOut, setLoadingTimedOut] = useState(false);

    const isSupabaseEnabled = isSupabaseConfigured();

    // Fetch user profile from database
    const fetchProfile = useCallback(async (userId: string) => {
        if (!supabase) return null;

        try {
            console.log('🔍 Fetching profile for user:', userId);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('❌ Error fetching profile:', error);
                return null;
            }

            console.log('✅ Profile fetched:', data);
            return data as UserProfile;
        } catch (error) {
            console.error('❌ Exception fetching profile:', error);
            return null;
        }
    }, []);

    // Refresh credits from database
    const refreshCredits = useCallback(async () => {
        if (!user || !supabase) return;

        const profileData = await fetchProfile(user.id);
        if (profileData) {
            setProfile(profileData);
        }
    }, [user, fetchProfile]);

    // Smart refresh of credits - only when window regains focus after being away for 5+ minutes
    useEffect(() => {
        if (!user || !supabase) return;

        let lastRefreshTime = Date.now();
        const MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes minimum between refreshes

        const handleFocus = () => {
            const timeSinceLastRefresh = Date.now() - lastRefreshTime;
            // Only refresh if it's been more than 5 minutes since last refresh
            if (timeSinceLastRefresh > MIN_REFRESH_INTERVAL) {
                console.log('🔄 Refreshing credits after returning (was away for', Math.round(timeSinceLastRefresh / 1000 / 60), 'mins)');
                refreshCredits();
                lastRefreshTime = Date.now();
            }
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [user, refreshCredits]);

    // Initialize auth state
    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        let mounted = true;
        let initialFetchDone = false; // Prevent duplicate fetches

        // Timeout to prevent indefinite loading (5 seconds max)
        const loadingTimeout = setTimeout(() => {
            if (mounted && isLoading) {
                console.warn('⚠️ Auth loading timed out after 5 seconds');
                setLoadingTimedOut(true);
                setIsLoading(false);
            }
        }, 5000);

        // Get initial session
        const initAuth = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('❌ Session retrieval error:', sessionError);
                }

                if (!mounted) return;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    console.log('🔍 Fetching profile for user:', session.user.id);
                    const profileData = await fetchProfile(session.user.id);
                    if (mounted && profileData) {
                        setProfile(profileData);
                        console.log('💰 Credits loaded:', profileData?.credits ?? 0);
                    }
                    initialFetchDone = true;
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error('Auth init error:', error);
            } finally {
                if (mounted) {
                    clearTimeout(loadingTimeout);
                    setIsLoading(false);
                }
            }
        };

        initAuth();

        // Listen for auth changes - skip INITIAL_SESSION since initAuth handles it
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                // Skip INITIAL_SESSION - initAuth already handles this
                if (event === 'INITIAL_SESSION') {
                    return;
                }

                console.log('Auth state changed:', event);

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    // Small delay to ensure DB trigger has completed
                    await new Promise(resolve => setTimeout(resolve, 100));
                    console.log('🔍 Fetching profile for user:', session.user.id);
                    const profileData = await fetchProfile(session.user.id);
                    if (mounted && profileData) {
                        setProfile(profileData);
                    }
                } else {
                    setProfile(null);
                }
            }
        );

        return () => {
            mounted = false;
            clearTimeout(loadingTimeout);
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    // Sign in with email/password
    const signIn = useCallback(async (email: string, password: string) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } as AuthError };
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error };
    }, []);

    // Sign up with email/password
    const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } as AuthError };
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || '',
                },
            },
        });

        return { error };
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        if (!supabase) return;

        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    }, []);

    // Update profile
    const updateProfile = useCallback(async (data: { full_name?: string }) => {
        if (!supabase || !user) {
            return { error: new Error('Not authenticated') };
        }

        const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id);

        if (!error) {
            await refreshCredits();
        }

        return { error: error ? new Error(error.message) : null };
    }, [user, refreshCredits]);

    // Context value - ensure loading is false if timed out
    const effectiveIsLoading = isLoading && !loadingTimedOut;

    const value: AuthContextType = {
        user,
        profile,
        credits: profile?.credits ?? 0,
        isLoading: effectiveIsLoading,
        isAuthenticated: !!user,
        isSupabaseEnabled,
        signIn,
        signUp,
        signOut,
        refreshCredits,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export default AuthContext;
