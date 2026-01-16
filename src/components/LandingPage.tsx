// src/components/LandingPage.tsx - Premium Landing with Orange Theme
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

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
        }, isDeleting ? 25 : 70);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, texts]);

    return (
        <span className={className}>
            {displayText}
            <span className="inline-block w-[3px] h-[0.9em] bg-orange-400 ml-1 animate-pulse rounded-sm" />
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
        'Blockchain',
        'Leadership'
    ];

    return (
        <div className="h-screen w-screen overflow-hidden fixed inset-0 bg-[#0a0a0f]">

            {/* ===== ANIMATED GRADIENT BACKGROUND ===== */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large gradient orb - top */}
                <div
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.4) 0%, rgba(251, 146, 60, 0.2) 30%, transparent 70%)',
                        filter: 'blur(60px)',
                        animation: 'pulse 6s ease-in-out infinite'
                    }}
                />
                {/* Accent orb - bottom right */}
                <div
                    className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 60%)',
                        filter: 'blur(50px)',
                        animation: 'pulse 8s ease-in-out infinite',
                        animationDelay: '2s'
                    }}
                />
                {/* Subtle mesh overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* ===== HEADER ===== */}
            <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-10 py-5">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={onGetStarted}>
                        <img src="/white-logo.png" alt="Pustakam" className="w-9 h-9" />
                        <span className="text-lg font-bold tracking-tight">PUSTAKAM</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLogin}
                            className="hidden sm:block px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl text-sm hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02]"
                        >
                            <Sparkles size={16} />
                            Get Started
                        </button>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="sm:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE MENU ===== */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col p-6">
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-3">
                            <img src="/white-logo.png" alt="Pustakam" className="w-9 h-9" />
                            <span className="text-lg font-bold">PUSTAKAM</span>
                        </div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 flex flex-col justify-center gap-8">
                        <button
                            onClick={() => { setMenuOpen(false); onLogin(); }}
                            className="text-left text-3xl font-medium text-white/60 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMenuOpen(false); onGetStarted(); }}
                            className="text-left text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                        >
                            Get Started →
                        </button>
                    </nav>
                </div>
            )}

            {/* ===== HERO SECTION ===== */}
            <main className="h-full flex items-center justify-center px-6 md:px-10 relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-sm font-medium text-orange-300/90">Free unlimited access</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                        <span className="text-white">Create a book about</span>
                        <br />
                        <TypeWriter
                            texts={topics}
                            className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent"
                        />
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Transform any topic into a comprehensive, structured book using AI.
                        <span className="text-white/60"> Bring your own API keys.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] hover:from-orange-400 hover:to-amber-400"
                        >
                            <Sparkles size={20} />
                            Start Creating — Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-8 py-4 border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-medium rounded-2xl text-base transition-all hover:bg-white/5"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Trust Line */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                            5+ AI Models
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                            100% Private
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                            Export as PDF
                        </span>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="absolute bottom-0 left-0 right-0 py-5 px-6 md:px-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-white/25">
                    <span>© 2026 Pustakam</span>
                    <span>Built by Tanmay Kalbande</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
