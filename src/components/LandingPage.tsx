// src/components/LandingPage.tsx - Variant 2: "The Generator" Focus
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles, Book, Command, Search } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Background Animation - Moving Mesh Gradient
function MeshGradient() {
    return (
        <div className="fixed inset-0 overflow-hidden -z-10 bg-[#050510]">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-blob" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

// Animated Mock Input Concept
function MockInput({ onClick }: { onClick: () => void }) {
    const prompts = [
        "Explain Quantum Physics like I'm 5",
        "A Complete Guide to Urban Gardening",
        "The History of Renaissance Art",
        "Python Programming for Beginners",
        "Modern Stoicism Philosophy"
    ];
    const [text, setText] = useState("");
    const [promptIndex, setPromptIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const currentPrompt = prompts[promptIndex];
        let timeout: NodeJS.Timeout;

        if (isTyping) {
            if (text.length < currentPrompt.length) {
                timeout = setTimeout(() => {
                    setText(currentPrompt.slice(0, text.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 2000);
            }
        } else {
            if (text.length > 0) {
                timeout = setTimeout(() => {
                    setText(text.slice(0, -1));
                }, 30);
            } else {
                setPromptIndex((prev) => (prev + 1) % prompts.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [text, isTyping, promptIndex]);

    return (
        <div
            onClick={onClick}
            className="w-full max-w-2xl mx-auto mt-12 bg-white/5 border border-white/10 rounded-2xl p-2 pl-6 pr-2 flex items-center gap-4 cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all group shadow-2xl shadow-black/50"
        >
            <Search className="text-white/30 group-hover:text-white/50 transition-colors" size={24} />
            <div className="flex-1 h-12 flex items-center text-lg sm:text-xl text-white/90 font-light">
                {text}
                <span className="w-0.5 h-6 bg-orange-500 animate-pulse ml-1" />
            </div>
            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors hidden sm:block">
                Generate
            </button>
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen text-white font-sans selection:bg-orange-500/30">
            <MeshGradient />

            {/* ===== HEADER ===== */}
            <header className="fixed top-0 inset-x-0 z-50 px-6 py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo Icon */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                            P
                        </div>
                        <span className="font-semibold tracking-tight">Pustakam</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                        <button onClick={onGetStarted} className="hover:text-white transition-colors">How it works</button>
                        <button onClick={onGetStarted} className="hover:text-white transition-colors">Showcase</button>
                        <button onClick={onLogin} className="hover:text-white transition-colors">Login</button>
                        <button
                            onClick={onGetStarted}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors border border-white/5"
                        >
                            Get Started
                        </button>
                    </nav>

                    <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-white/70 hover:text-white">
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* ===== HERO ===== */}
            <main className="min-h-screen flex flex-col justify-center px-6 pt-20 relative z-10">
                <div className="max-w-5xl mx-auto w-full text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-orange-300 mb-8 mx-auto hover:bg-white/10 transition-colors cursor-default">
                        <Sparkles size={12} />
                        <span>v2.0 Now Available</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                        Knowledge, <br />
                        <span className="">Generated.</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl sm:text-2xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-4">
                        The AI engine that turns your curiosity into comprehensive books.
                        Structured chapters, deep content, instant exports.
                    </p>

                    {/* Mock Input Interaction */}
                    <MockInput onClick={onGetStarted} />

                    {/* Bottom Features */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-10">
                        <div className="text-center group cursor-default">
                            <div className="flex justify-center mb-3 text-white/20 group-hover:text-orange-400 transition-colors">
                                <Command size={24} />
                            </div>
                            <h3 className="font-semibold text-white/80">AI Powered</h3>
                            <p className="text-sm text-white/30 mt-1">Mistral & Gemini & Groq</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="flex justify-center mb-3 text-white/20 group-hover:text-blue-400 transition-colors">
                                <Book size={24} />
                            </div>
                            <h3 className="font-semibold text-white/80">Full Books</h3>
                            <p className="text-sm text-white/30 mt-1">Not just summaries</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="flex justify-center mb-3 text-white/20 group-hover:text-green-400 transition-colors">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="font-semibold text-white/80">Export Ready</h3>
                            <p className="text-sm text-white/30 mt-1">PDF & Markdown</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="flex justify-center mb-3 text-white/20 group-hover:text-purple-400 transition-colors">
                                <ArrowRight size={24} />
                            </div>
                            <h3 className="font-semibold text-white/80">Free Start</h3>
                            <p className="text-sm text-white/30 mt-1">No credit card required</p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-[#050510] flex flex-col p-6 animate-in slide-in-from-right duration-200">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                P
                            </div>
                            <span className="font-semibold">Pustakam</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="p-2 bg-white/5 rounded-lg text-white/70">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-6">
                        <button onClick={onGetStarted} className="text-3xl font-bold text-white text-left">Create Book</button>
                        <button onClick={onLogin} className="text-3xl font-bold text-white/40 text-left hover:text-white transition-colors">Login</button>
                        <div className="h-px bg-white/10 my-4" />
                        <p className="text-white/30 text-sm">Experience the future of learning.</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
