// src/components/WelcomeModal.tsx
// Premium welcome modal matching landing page style
import React from 'react';
import { X, Sparkles, BookOpen, Zap, Download, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBuyCredits: () => void;
}

export function WelcomeModal({ isOpen, onClose, onBuyCredits }: WelcomeModalProps) {
    const { profile, credits } = useAuth();
    if (!isOpen) return null;

    const firstName = profile?.full_name?.split(' ')[0] || 'Creator';
    const isPro = profile?.plan === 'monthly' || profile?.plan === 'yearly';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white transition-colors z-10">
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="p-6 text-center">
                    {/* Icon with glow */}
                    <div className="inline-flex mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full" />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <Sparkles size={28} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Greeting */}
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">
                        Transform any idea into a comprehensive AI-generated book
                    </p>

                    {/* Credit/Pro Status */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">
                                {isPro ? 'Plan' : 'Credits Available'}
                            </span>
                            <span className={`text-2xl font-bold ${isPro ? 'text-orange-400' : credits > 0 ? 'text-amber-400' : 'text-gray-500'}`}>
                                {isPro ? 'PRO' : credits}
                            </span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                                style={{ width: isPro ? '100%' : `${Math.min(credits * 20, 100)}%` }}
                            />
                        </div>
                        <p className="text-gray-500 text-xs mt-3">
                            {isPro ? 'Unlimited book generation' : credits === 0 ? 'Purchase credits to create books' : `${credits} book${credits > 1 ? 's' : ''} remaining`}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { icon: BookOpen, label: 'Full Books' },
                            { icon: Zap, label: 'Fast AI' },
                            { icon: Download, label: 'Export' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="p-3 bg-white/[0.02] rounded-lg">
                                <Icon size={16} className="text-orange-400 mx-auto mb-1.5" />
                                <span className="text-xs text-gray-400">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        {credits === 0 && !isPro ? (
                            <>
                                <button
                                    onClick={() => { onClose(); onBuyCredits(); }}
                                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>Get Credits</span>
                                    <ArrowRight size={16} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-lg transition-all"
                                >
                                    Explore First
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Check size={16} />
                                <span>Start Creating</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeModal;
