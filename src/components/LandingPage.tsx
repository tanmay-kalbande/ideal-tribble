// src/components/LandingPage.tsx - Ultra-Minimal, Eye-Catching Landing
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Animated typing effect
function TypeWriter({ texts, className }: { texts: string[]; className?: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[currentIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentText.length) {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? 30 : 80);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, texts]);

    return (
        <span className={className}>
            {displayText}
            <span className="inline-block w-0.5 h-[1em] bg-orange-400 ml-1 animate-pulse" />
        </span>
    );
}

// Floating orbs background
function FloatingOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-orange-600/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const topics = [
        'AI and Machine Learning',
        'Quantum Computing',
        'Business Strategy',
        'Philosophy',
        'Web Development',
        'Data Science',
        'Psychology',
        'Creative Writing'
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">
            <FloatingOrbs />

            {/* ===== HEADER - Ultra Minimal ===== */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-9 h-9" />
                        <span className="text-lg font-bold tracking-tight hidden sm:block">PUSTAKAM</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Login
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-5 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-white/90 transition-all"
                        >
                            Get Started
                        </button>
                        <button onClick={() => setMenuOpen(true)} className="sm:hidden p-2 hover:bg-white/10 rounded-lg">
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE MENU ===== */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col p-6">
                    <div className="flex items-center justify-between mb-20">
                        <div className="flex items-center gap-3">
                            <img src="/white-logo.png" alt="Pustakam" className="w-9 h-9" />
                            <span className="text-lg font-bold">PUSTAKAM</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 flex flex-col justify-center gap-8">
                        <button
                            onClick={() => { setMenuOpen(false); onLogin(); }}
                            className="text-left text-3xl font-semibold text-white/70 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); onGetStarted(); }}
                            className="text-left text-3xl font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            Get Started →
                        </button>
                    </nav>
                </div>
            )}

            {/* ===== HERO - Full Screen, Centered, Minimal ===== */}
            <main className="min-h-screen flex items-center justify-center px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Small Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-sm text-white/70">AI-Powered Book Generation</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8">
                        Create a book about
                        <br />
                        <TypeWriter
                            texts={topics}
                            className="text-orange-400"
                        />
                    </h1>

                    {/* Sub-headline */}
                    <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
                        Transform any topic into a comprehensive, structured book in minutes. Bring your own API keys.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="group w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-full text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/30"
                        >
                            Start Creating Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 font-medium rounded-full text-lg transition-all"
                        >
                            I have an account
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex items-center justify-center gap-8 text-sm text-white/40">
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            <span>5+ AI Models</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>100% Privacy</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Free to Start</span>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER - Ultra Minimal ===== */}
            <footer className="absolute bottom-0 left-0 right-0 py-6 px-6 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-white/30">
                    <span>© 2026 Pustakam</span>
                    <span>Created by Tanmay Kalbande</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
