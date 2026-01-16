// src/components/LandingPage.tsx - Ultra-Minimal, Non-Scrollable Landing
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

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
        }, isDeleting ? 25 : 70);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, texts]);

    return (
        <span className={className}>
            {displayText}
            <span className="inline-block w-[2px] h-[0.85em] bg-white/60 ml-1 animate-pulse" />
        </span>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="h-screen w-screen bg-[#09090b] text-white font-sans overflow-hidden fixed inset-0">

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />

            {/* ===== HEADER ===== */}
            <header className="absolute top-0 left-0 right-0 z-50 px-5 sm:px-8 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                        <span className="text-base font-semibold tracking-tight opacity-90">PUSTAKAM</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onLogin}
                            className="hidden sm:block px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 py-2 text-sm font-medium text-white/90 border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/30 transition-all"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="sm:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Menu size={20} className="opacity-70" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE MENU ===== */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-[#09090b] flex flex-col p-6">
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-2.5">
                            <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                            <span className="text-base font-semibold">PUSTAKAM</span>
                        </div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X size={22} className="opacity-70" />
                        </button>
                    </div>
                    <nav className="flex-1 flex flex-col justify-center gap-6">
                        <button
                            onClick={() => { setMenuOpen(false); onLogin(); }}
                            className="text-left text-2xl text-white/50 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); onGetStarted(); }}
                            className="text-left text-2xl font-medium text-white hover:text-white/80 transition-colors flex items-center gap-3"
                        >
                            Get Started <ArrowRight size={22} />
                        </button>
                    </nav>
                </div>
            )}

            {/* ===== HERO - Centered, Non-Scrollable ===== */}
            <main className="h-full flex items-center justify-center px-5 sm:px-8">
                <div className="max-w-3xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-white/50 font-medium">Free unlimited access — Limited time</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.15] mb-5 tracking-tight">
                        <span className="text-white/90">Create a complete book about</span>
                        <br />
                        <TypeWriter
                            texts={topics}
                            className="text-white/60"
                        />
                    </h1>

                    {/* Subheadline */}
                    <p className="text-sm sm:text-base text-white/35 max-w-lg mx-auto mb-8 leading-relaxed">
                        Transform any topic into a structured, comprehensive book using AI. Bring your own API keys.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={onGetStarted}
                            className="group w-full sm:w-auto px-6 py-3 bg-white text-black font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2 hover:bg-white/90"
                        >
                            Start Creating
                            <ArrowRight size={16} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-6 py-3 text-sm text-white/50 hover:text-white transition-colors"
                        >
                            I have an account
                        </button>
                    </div>

                    {/* Trust Line */}
                    <p className="mt-10 text-xs text-white/20">
                        5+ AI models • 100% private • Export as PDF
                    </p>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="absolute bottom-0 left-0 right-0 py-4 px-5 sm:px-8">
                <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20">
                    <span>© 2026 Pustakam</span>
                    <span>by Tanmay Kalbande</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
