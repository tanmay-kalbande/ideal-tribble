// src/components/LandingPage.tsx - Stable Minimal Landing
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/20 blur-[120px] pointer-events-none" />

            {/* ===== HEADER ===== */}
            <header className="relative z-50 px-6 md:px-12 py-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                        <span className="text-base font-semibold">PUSTAKAM</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLogin}
                            className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block"
                        >
                            Login
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-5 py-2.5 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <main className="relative z-10 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-6 text-center">

                {/* Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
                    <Sparkles size={14} className="text-orange-400" />
                    <span className="text-sm text-white/60">AI-Powered Book Generation</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl leading-[1.1]">
                    Turn any idea into a
                    <span className="block text-orange-400">complete book</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-white/40 max-w-md mb-12">
                    Enter a topic, let AI do the rest. Full chapters, not summaries.
                </p>

                {/* CTA */}
                <button
                    onClick={onGetStarted}
                    className="group px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl text-lg transition-all flex items-center gap-3 shadow-lg shadow-orange-500/25"
                >
                    Start Creating Free
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Line */}
                <p className="text-sm text-white/30 mt-8">
                    5+ AI models • 100% private • No credit card required
                </p>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="relative z-10 py-6 px-6 text-center">
                <p className="text-xs text-white/20">
                    © 2026 Pustakam • By Tanmay Kalbande
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
