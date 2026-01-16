// src/components/LandingPage.tsx - Professional, Minimal Landing Page
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles, BookOpen, Shield, Zap, Check } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Animated typing effect with cursor
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
                    setTimeout(() => setIsDeleting(true), 2500);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? 25 : 70);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, texts]);

    return (
        <span className={className}>
            {displayText}
            <span className="inline-block w-[3px] h-[0.9em] bg-orange-500 ml-1 animate-pulse rounded-sm" />
        </span>
    );
}

// Subtle animated gradient background
function GradientBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Main gradient orbs */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-orange-500/8 via-transparent to-transparent blur-3xl"
                style={{ animation: 'pulse 8s ease-in-out infinite' }}
            />
            <div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-amber-500/5 via-transparent to-transparent blur-3xl"
                style={{ animation: 'pulse 10s ease-in-out infinite', animationDelay: '2s' }}
            />
            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    // Diverse topics for the typewriter
    const topics = [
        'Machine Learning',
        'Philosophy',
        'Business Strategy',
        'Quantum Physics',
        'Psychology',
        'Web Development',
        'Creative Writing',
        'Data Science',
        'Economics',
        'Neuroscience',
        'Product Design',
        'Marketing',
        'History',
        'Blockchain',
        'Leadership'
    ];

    return (
        <div className="min-h-screen bg-[#08080c] text-white font-sans relative overflow-hidden">
            <GradientBackground />

            {/* ===== HEADER ===== */}
            <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 bg-gradient-to-b from-[#08080c] via-[#08080c]/90 to-transparent">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8 sm:w-9 sm:h-9" />
                        <span className="text-base sm:text-lg font-bold tracking-tight">PUSTAKAM</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onLogin}
                            className="hidden sm:block px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-black font-semibold rounded-full text-xs sm:text-sm hover:bg-white/90 transition-all hover:scale-[1.02]"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE MENU ===== */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-[#08080c] flex flex-col p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-3">
                            <img src="/white-logo.png" alt="Pustakam" className="w-9 h-9" />
                            <span className="text-lg font-bold">PUSTAKAM</span>
                        </div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 flex flex-col justify-center gap-6">
                        <button
                            onClick={() => { setMenuOpen(false); onLogin(); }}
                            className="text-left text-2xl font-medium text-white/60 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); onGetStarted(); }}
                            className="text-left text-2xl font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-3"
                        >
                            Get Started Free <ArrowRight size={24} />
                        </button>
                    </nav>
                </div>
            )}

            {/* ===== HERO SECTION ===== */}
            <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-20 pb-16 relative z-10">
                <div className="max-w-4xl mx-auto text-center w-full">

                    {/* Launch Badge */}
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 mb-6 sm:mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-orange-300">
                            🎉 Completely Free • Unlimited Books • Limited Time
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6 tracking-tight">
                        <span className="text-white/90">Create a book about</span>
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        <TypeWriter
                            texts={topics}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400"
                        />
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base sm:text-lg lg:text-xl text-white/40 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                        Transform any topic into a comprehensive, well-structured book in minutes using AI.
                        <span className="text-white/60"> Bring your own API keys. Keep full control.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 px-4">
                        <button
                            onClick={onGetStarted}
                            className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-full text-base sm:text-lg transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02]"
                        >
                            <Sparkles size={18} className="sm:w-5 sm:h-5" />
                            Start Creating — It's Free
                            <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/15 hover:border-white/30 hover:bg-white/5 font-medium rounded-full text-base sm:text-lg transition-all text-white/70 hover:text-white"
                        >
                            I have an account
                        </button>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16 px-2">
                        {[
                            { icon: Zap, text: '5+ AI Models' },
                            { icon: Shield, text: '100% Private' },
                            { icon: BookOpen, text: 'Export as PDF' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs sm:text-sm"
                            >
                                <item.icon size={14} className="text-orange-400/70" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Social Proof / Trust */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/30">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-[#08080c] flex items-center justify-center text-[10px] font-bold text-white"
                                    >
                                        {['T', 'A', 'M', 'K'][i]}
                                    </div>
                                ))}
                            </div>
                            <span>1,000+ creators</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-1.5">
                            <Check size={14} className="text-green-400" />
                            <span>No credit card required</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="absolute bottom-0 left-0 right-0 py-4 sm:py-6 px-4 sm:px-6 z-10">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-white/25">
                    <span>© 2026 Pustakam</span>
                    <span className="text-white/15">Built by Tanmay Kalbande</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
