// src/components/LandingPage.tsx - Variant 3: Split Screen with Visual Demo
import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Animated book generation preview
function BookPreview() {
    const [lines, setLines] = useState<string[]>([]);
    const content = [
        '# Introduction to Quantum Computing',
        '',
        'Quantum computing represents a fundamental',
        'shift in how we process information...',
        '',
        '## Key Concepts',
        '',
        '**Qubits** - Unlike classical bits, qubits',
        'can exist in superposition states...',
        '',
        '**Entanglement** - Quantum particles can',
        'be correlated across distances...',
    ];

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < content.length) {
                setLines(prev => [...prev, content[index]]);
                index++;
            } else {
                setLines([]);
                index = 0;
            }
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Window Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-3 text-xs text-white/30 font-mono">generating...</span>
                </div>
                {/* Content */}
                <div className="p-5 h-64 overflow-hidden font-mono text-sm">
                    {lines.map((line, i) => (
                        <div
                            key={i}
                            className={`${line.startsWith('#') ? 'text-orange-400 font-bold' :
                                    line.startsWith('**') ? 'text-amber-300' :
                                        'text-white/60'
                                } ${line === '' ? 'h-4' : ''}`}
                            style={{ animation: 'fadeIn 0.3s ease-out' }}
                        >
                            {line}
                        </div>
                    ))}
                    <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    return (
        <div className="min-h-screen bg-black text-white font-sans">

            {/* ===== HEADER ===== */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 bg-black/50 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src="/white-logo.png" alt="Pustakam" className="w-7 h-7" />
                        <span className="text-sm font-bold tracking-wider">PUSTAKAM</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="text-sm text-white/50 hover:text-white transition-colors">
                            Login
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Try Free
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== HERO - Split Layout ===== */}
            <main className="min-h-screen pt-20 flex items-center">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16">

                    {/* Left - Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
                            <Sparkles size={12} />
                            AI Book Engine
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                            Give us a topic.
                            <br />
                            <span className="text-white/40">We'll write the book.</span>
                        </h1>

                        <p className="text-lg text-white/40 mb-10 max-w-md">
                            AI-powered book generation. Full chapters, not summaries. Ready in minutes, not months.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={onGetStarted}
                                className="group px-7 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                            >
                                Start Writing
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onLogin}
                                className="px-7 py-4 border border-white/20 rounded-xl font-medium hover:bg-white/5 transition-all"
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-white/30">
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} />
                                <span>5+ AI models</span>
                            </div>
                            <span>•</span>
                            <span>Export to PDF</span>
                            <span>•</span>
                            <span>Free tier</span>
                        </div>
                    </div>

                    {/* Right - Visual Demo */}
                    <div className="hidden lg:block">
                        <BookPreview />
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="py-6 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/30">
                    <span>© 2026 Pustakam</span>
                    <span>By Tanmay Kalbande</span>
                </div>
            </footer>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
