// src/components/LandingPage.tsx - Spotlight Beam + Staggered Text Reveal
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setRevealed(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">

            {/* Spotlight Beam */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Main beam from top */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[40vh]"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(249,115,22,0.8), transparent)',
                    }}
                />
                {/* Scattered glow */}
                <div
                    className="absolute top-[35vh] left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 60%)',
                    }}
                />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* ===== HEADER ===== */}
            <header className="relative z-50 px-6 md:px-12 py-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                        <span className="text-sm font-bold tracking-wider">PUSTAKAM</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">
                            Login
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-orange-400 hover:text-white transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <main className="relative z-10 min-h-[calc(100vh-100px)] flex items-center justify-center px-6">
                <div className="max-w-3xl mx-auto text-center">

                    {/* Staggered Title Reveal */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
                        <span
                            className={`block transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '0ms' }}
                        >
                            Ideas in.
                        </span>
                        <span
                            className={`block text-orange-400 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            Books out.
                        </span>
                    </h1>

                    {/* Tagline */}
                    <p
                        className={`text-lg sm:text-xl text-white/40 mb-12 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        AI book generation in minutes.
                    </p>

                    {/* CTA */}
                    <div
                        className={`transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: '600ms' }}
                    >
                        <button
                            onClick={onGetStarted}
                            className="group px-10 py-5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-2xl text-lg transition-all flex items-center gap-3 mx-auto shadow-2xl shadow-orange-500/30 hover:shadow-orange-400/40 hover:scale-105"
                        >
                            <Sparkles size={20} />
                            Create Your Book
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Minimal Stats */}
                    <div
                        className={`mt-16 flex items-center justify-center gap-12 text-white/25 transition-all duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: '800ms' }}
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white/60">5+</div>
                            <div className="text-xs uppercase tracking-wide">AI Models</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white/60">Free</div>
                            <div className="text-xs uppercase tracking-wide">To Start</div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white/60">100%</div>
                            <div className="text-xs uppercase tracking-wide">Private</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="relative z-10 py-6 px-6 text-center text-xs text-white/15">
                © 2026 Pustakam • By Tanmay Kalbande
            </footer>
        </div>
    );
};

export default LandingPage;
