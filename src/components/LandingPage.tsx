// src/components/LandingPage.tsx - Variant 2: Bold Gradient Hero
import React, { useState } from 'react';
import { ArrowRight, Sparkles, BookOpen, Zap } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-hidden">

            {/* Gradient Mesh Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-600/30 via-orange-500/10 to-transparent blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
            </div>

            {/* ===== HEADER ===== */}
            <header className="relative z-50 px-6 md:px-12 py-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                        <span className="text-base font-semibold tracking-wide">PUSTAKAM</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onLogin} className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
                            Sign in
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-sm font-medium transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <main className="relative z-10 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center px-6 text-center">

                {/* Pill Badge */}
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-8">
                    <Zap size={14} className="text-orange-400" />
                    <span className="text-sm text-orange-300">Powered by AI</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.05]">
                    Books that write
                    <br />
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                        themselves
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-white/40 max-w-lg mb-12">
                    Enter a topic. Get a complete book. It's that simple.
                </p>

                {/* Email Input + CTA */}
                <div className="w-full max-w-md">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="What do you want to learn?"
                            className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all"
                        />
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            Create
                            <ArrowRight size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-white/30 mt-4">
                        Free to start • Bring your own API keys • No credit card required
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
                    {[
                        { icon: BookOpen, text: '5+ AI Models' },
                        { icon: Sparkles, text: 'Full Books, Not Snippets' },
                        { icon: Zap, text: 'Generate in Minutes' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
                            <item.icon size={14} className="text-white/40" />
                            <span className="text-sm text-white/50">{item.text}</span>
                        </div>
                    ))}
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="relative z-10 py-8 px-6 text-center">
                <p className="text-xs text-white/20">
                    © 2026 Pustakam • Created by Tanmay Kalbande
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
