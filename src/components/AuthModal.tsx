// src/components/AuthModal.tsx
// Authentication modal with Frans Hals Museum inspired design

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Loader2, ArrowRight, Eye, EyeOff, BookOpen, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialMode?: 'signin' | 'signup' | 'subscribe';
}

type AuthMode = 'signin' | 'signup' | 'subscribe';

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signin' }: AuthModalProps) {
    const { signIn, signUp, isSupabaseEnabled, user } = useAuth();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showContactOptions, setShowContactOptions] = useState(false);

    // Reset mode when modal opens
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError(null);
            // If user is logged in and mode is subscribe, show contact options directly
            if (user && initialMode === 'subscribe') {
                setShowContactOptions(true);
            } else {
                setShowContactOptions(false);
            }
        }
    }, [isOpen, initialMode, user]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (mode === 'signin' || mode === 'subscribe') {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    if (mode === 'subscribe') {
                        // Show contact options after successful login for subscription
                        setShowContactOptions(true);
                    } else {
                        onSuccess?.();
                        onClose();
                    }
                }
            } else {
                const { error } = await signUp(email, password, fullName);
                if (error) {
                    setError(error.message);
                } else {
                    onSuccess?.();
                    onClose();
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError(null);
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Hi! I want to subscribe to Pustakam premium plan.');
        window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
        onClose();
    };

    const handleEmail = () => {
        const subject = encodeURIComponent('Pustakam Premium Subscription');
        const body = encodeURIComponent('Hi,\n\nI want to subscribe to Pustakam premium plan.\n\nThanks!');
        window.open(`mailto:support@pustakam.com?subject=${subject}&body=${body}`, '_blank');
        onClose();
    };

    // Show contact options after login for subscription
    if (showContactOptions) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-sm bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors z-10">
                        <X size={18} />
                    </button>

                    <div className="relative p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center">
                            <BookOpen size={32} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Subscribe to Premium</h2>
                        <p className="text-sm text-gray-500 mb-8">Choose how you'd like to contact us</p>

                        <div className="space-y-3">
                            <button
                                onClick={handleWhatsApp}
                                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors"
                            >
                                <MessageCircle size={20} />
                                <span>WhatsApp</span>
                            </button>
                            <button
                                onClick={handleEmail}
                                className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-3 transition-colors"
                            >
                                <Send size={20} />
                                <span>Email Us</span>
                            </button>
                        </div>

                        <p className="text-xs text-gray-600 mt-6">We'll respond within 24 hours</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />

                {/* Close button */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors z-10">
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="relative p-8 pb-4 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                        <BookOpen size={28} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                        {mode === 'subscribe' ? 'Sign In to Subscribe' : mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        {mode === 'subscribe'
                            ? 'Sign in to continue with subscription'
                            : mode === 'signin'
                                ? 'Sign in to continue to Pustakam'
                                : 'Get started with AI book generation'
                        }
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative px-8 pb-8 space-y-4">
                    {!isSupabaseEnabled && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <p className="text-amber-400 text-xs text-center">⚠️ Auth not configured</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-xs text-center">{error}</p>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 font-medium">NAME</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-gray-500 mb-2 font-medium">EMAIL</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-2 font-medium">PASSWORD</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isSupabaseEnabled}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                    >
                        {isLoading ? (
                            <><Loader2 size={18} className="animate-spin" /><span>Please wait...</span></>
                        ) : (
                            <><span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span><ArrowRight size={18} /></>
                        )}
                    </button>

                    {mode !== 'subscribe' && (
                        <div className="text-center pt-2">
                            <button type="button" onClick={toggleMode} className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
                                {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AuthModal;
