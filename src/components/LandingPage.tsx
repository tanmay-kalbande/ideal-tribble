import React, { useState, useEffect } from 'react';
import { MoveRight, ArrowUp } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Grok-Style Dramatic Gradient Background
const GrokBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Deep space gradient base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#000814] via-[#001220] to-[#000000]" />
            
            {/* Dramatic center glow - the key Grok effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
                <div className="absolute inset-0 bg-gradient-radial from-[#1e3a8a]/30 via-[#1e40af]/20 to-transparent blur-3xl animate-nebula-pulse" />
                <div className="absolute inset-0 bg-gradient-radial from-[#3b82f6]/20 via-[#2563eb]/10 to-transparent blur-2xl animate-nebula-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            {/* Bright white/blue core glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[600px] h-[300px] bg-gradient-radial from-white/40 via-blue-400/30 to-transparent blur-3xl" />
            </div>
            
            {/* Subtle particle field */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5,
                            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const LandingPage = ({ onLogin, onGetStarted }: LandingPageProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden font-sans">
            <GrokBackground />

            {/* Minimalist Noise Overlay */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none z-10" />

            {/* Float Navigation */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'bg-black/20 backdrop-blur-md border-b border-white/5' : ''}`}>
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img src="/white-logo.png" alt="P" className="w-6 h-6 opacity-90" />
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            {['Engine', 'Documentation', 'Archive'].map((item) => (
                                <button key={item} className="text-[13px] font-medium tracking-wide opacity-50 hover:opacity-100 transition-opacity uppercase">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={onLogin} className="text-[13px] font-medium tracking-wide opacity-50 hover:opacity-100 transition-opacity uppercase hidden sm:block">Login</button>
                        <button
                            onClick={onGetStarted}
                            className="border border-white/10 px-6 py-2 rounded-full text-[12px] font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                        >
                            Try Pustakam
                        </button>
                    </div>
                </nav>
            </header>

            {/* Centered Hero Section */}
            <main className="relative z-20 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
                <div className="mb-12 transition-all duration-1000">
                    <h1 className="text-[clamp(4rem,12vw,9rem)] font-bold tracking-[-0.04em] leading-none text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.5)]" style={{
                        textShadow: '0 0 100px rgba(255,255,255,0.8), 0 0 50px rgba(147,197,253,0.6), 0 0 25px rgba(59,130,246,0.4)'
                    }}>
                        Pustakam
                    </h1>
                </div>

                <div className="w-full max-w-2xl relative group mb-12">
                    <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                    <div className="relative bg-[#0d0d0d]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all group-focus-within:border-white/20 shadow-2xl">
                        <div className="flex-1 flex flex-col items-start px-2">
                            <textarea
                                value={inputText}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                                placeholder="What do you want to learn?"
                                className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl placeholder-white/20 resize-none h-12 py-2"
                            />
                        </div>
                        <button
                            onClick={onGetStarted}
                            className={`p-3 rounded-xl transition-all ${inputText.trim() ? 'bg-white text-black' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            <ArrowUp size={24} />
                        </button>
                    </div>
                </div>

                <div className="max-w-lg text-white/30 text-sm md:text-base leading-relaxed font-light tracking-wide px-4">
                    Pustakam synthesizes high-fidelity knowledge archives from your prompts.
                    Built for rapid exploration and deep academic research.
                </div>

                {/* Subtle Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity cursor-pointer delay-1000 animate-fade-in" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
            </main>

            {/* Sparse Features / Collection */}
            <section className="relative z-20 py-32 px-6 border-t border-white/5 bg-[#050505]/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
                    <div className="max-w-md">
                        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-blue-400 mb-4 block">Engine Status</span>
                        <h2 className="text-4xl font-normal tracking-tight mb-4 text-white">The Knowledge Store</h2>
                        <p className="text-white/40 text-lg leading-relaxed font-light">
                            Explore thousands of community-generated archives across science, technology, and philosophy.
                        </p>
                    </div>
                    <button className="flex items-center gap-3 text-[12px] font-medium tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity group">
                        Enter Archive
                        <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Neural Ethics', desc: 'Synthesized exploration of AI alignment theory.' },
                        { title: 'Quantum Computation', desc: 'From qubits to topological gates.' },
                        { title: 'Stoic Architecture', desc: 'Applying ancient logic to modern systems.' }
                    ].map((item, i) => (
                        <div key={i} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                            <h3 className="text-xl font-medium mb-3 text-white/90 group-hover:text-white transition-colors">{item.title}</h3>
                            <p className="text-white/30 font-light leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sparse Footer */}
            <footer className="relative z-20 py-24 px-6 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-[14px] tracking-tight text-white/90">Pustakam</span>
                            <span className="text-[10px] font-mono tracking-widest text-white/20">v2.0.4</span>
                        </div>
                        <p className="text-white/20 text-xs font-light">© 2026 Crafted with precision</p>
                    </div>

                    <div className="flex gap-12">
                        {['Press', 'Careers', 'GitHub'].map((social) => (
                            <button key={social} className="text-[12px] font-medium tracking-widest uppercase opacity-30 hover:opacity-100 transition-opacity">
                                {social}
                            </button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
