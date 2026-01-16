// src/components/LandingPage.tsx - Variant: Morphing Gradient Blob + Clean Typography
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden">

            {/* Animated Gradient Blob */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="w-[500px] h-[500px] opacity-60"
                    style={{
                        background: 'conic-gradient(from 0deg, #f97316, #fbbf24, #f97316, #ea580c, #f97316)',
                        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                        filter: 'blur(80px)',
                        animation: 'morph 8s ease-in-out infinite, spin 20s linear infinite',
                    }}
                />
            </div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes morph {
                    0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                    25% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    75% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Noise Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ===== HEADER ===== */}
            <header className="relative z-50 px-6 md:px-12 py-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                        <span className="text-sm font-bold tracking-widest uppercase">Pustakam</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <button onClick={onLogin} className="text-sm text-white/40 hover:text-white transition-colors">
                            Sign in
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-5 py-2.5 border border-white/20 hover:bg-white hover:text-black rounded-full text-sm font-medium transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <main className="relative z-10 min-h-[calc(100vh-100px)] flex items-center justify-center px-6">
                <div className="max-w-2xl mx-auto text-center">

                    {/* Main Headline */}
                    <h1
                        className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        Write books with
                        <br />
                        <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                            artificial intelligence
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className={`text-base sm:text-lg text-white/35 mb-10 max-w-md mx-auto transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        From idea to complete book in minutes. 5+ AI models, full chapters, PDF export.
                    </p>

                    {/* CTA Button */}
                    <div
                        className={`transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <button
                            onClick={onGetStarted}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full text-base hover:bg-orange-400 hover:text-white transition-all shadow-xl shadow-white/10 hover:shadow-orange-400/20"
                        >
                            Start creating — it's free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Trust Badge */}
                    <p
                        className={`mt-10 text-xs text-white/20 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    >
                        Bring your own API keys • 100% private • No credit card
                    </p>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="relative z-10 py-6 px-6 text-center">
                <p className="text-xs text-white/15">
                    © 2026 Pustakam — Tanmay Kalbande
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
