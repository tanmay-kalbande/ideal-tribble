// src/components/LandingPage.tsx - Bold Minimal Landing
import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Gradient Background */}
            <div className="fixed inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/10" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-orange-500/20 to-transparent blur-3xl" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                        <span className="text-base font-semibold tracking-tight hidden sm:block">Pustakam</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onLogin}
                            className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-all"
                        >
                            Start Free
                        </button>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="sm:hidden p-2 hover:bg-white/10 rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col p-6">
                    <div className="flex items-center justify-between mb-20">
                        <div className="flex items-center gap-3">
                            <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                            <span className="text-base font-semibold">Pustakam</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="p-2">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 flex flex-col justify-center gap-6">
                        <button
                            onClick={() => { setMenuOpen(false); onLogin(); }}
                            className="text-left text-2xl text-white/60 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); onGetStarted(); }}
                            className="text-left text-2xl text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
                        >
                            Get Started <ArrowRight size={24} />
                        </button>
                    </nav>
                </div>
            )}

            {/* Hero */}
            <main className="relative min-h-screen flex items-center justify-center px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-xs text-white/70 font-medium">AI-Powered • Free to Start</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
                        Create books
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                            with AI
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Generate complete, structured books on any topic in minutes.
                        <br className="hidden sm:block" />
                        No credit card. Bring your own API keys.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
                        <button
                            onClick={onGetStarted}
                            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-full text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                        >
                            Start Creating
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-white/30 hover:bg-white/5 font-medium rounded-full text-base transition-all"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Trust Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white/60">
                            <Sparkles size={14} className="inline mr-1.5 text-orange-400" />
                            5+ AI Models
                        </div>
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white/60">
                            100% Privacy
                        </div>
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white/60">
                            Free Forever
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 right-0 py-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
                    <span>© 2026 Pustakam</span>
                    <span>Created by Tanmay Kalbande</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
