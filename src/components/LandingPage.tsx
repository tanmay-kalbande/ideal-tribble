import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Shield, Download, ArrowRight, MoveRight } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Minimalist Generation Mockup
function BookGenerationMockup() {
    const [currentModule, setCurrentModule] = useState(1);
    const [progress, setProgress] = useState(10);
    const [typedText, setTypedText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    const chapters = [
        { title: 'The Future of AI Ethics', text: 'Artificial intelligence is reshaping our world. The ethical framework we build now will determine the course of human history...' },
        { title: 'Algorithmic Complexity', text: 'To understand the scale of modern systems, one must first grasp the underlying patterns of data distribution...' },
    ];

    const currentChapter = chapters[(currentModule - 1) % chapters.length];

    useEffect(() => {
        const moduleInterval = setInterval(() => {
            setCurrentModule((m: number) => {
                const nextModule = m >= 10 ? 1 : m + 1;
                setCharIndex(0);
                setTypedText('');
                setProgress(nextModule * 10);
                return nextModule;
            });
        }, 5000);
        return () => clearInterval(moduleInterval);
    }, []);

    useEffect(() => {
        const fullText = currentChapter.text;
        const typeInterval = setInterval(() => {
            setCharIndex((prev: number) => {
                if (prev < fullText.length) {
                    setTypedText(fullText.substring(0, prev + 1));
                    return prev + 1;
                }
                return prev;
            });
        }, 15);
        return () => clearInterval(typeInterval);
    }, [currentModule, currentChapter.text]);

    return (
        <div className="relative w-full max-w-lg mx-auto group">
            {/* Subtle Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-amber-500/10 blur-2xl rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative bg-[#080808] rounded-24 overflow-hidden border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                {/* Visual Header */}
                <div className="p-6 border-b border-white/5 bg-white/2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[11px] font-mono tracking-[0.2em] text-white/40 uppercase">System Status: Generating</span>
                        </div>
                        <span className="text-[11px] font-mono text-orange-400/80">{progress}%</span>
                    </div>
                    <div className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 h-48 flex flex-col justify-center">
                    <div className="text-[12px] font-mono text-orange-400 mb-3 opacity-70">CHAPTER {currentModule}</div>
                    <h3 className="text-xl font-medium text-white mb-4 tracking-tight">{currentChapter.title}</h3>
                    <div className="text-sm text-white/40 leading-relaxed font-sans">
                        {typedText}<span className="inline-block w-[1px] h-4 bg-orange-500/50 ml-1 animate-pulse" />
                    </div>
                </div>

                {/* Action Bar */}
                <div className="px-8 py-5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {[...Array(24)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-3 rounded-full transition-all duration-500 ${i < (progress / 4) ? 'bg-orange-500/40' : 'bg-white/5'}`}
                            />
                        ))}
                    </div>
                    <div className="text-[10px] font-mono text-white/20 tracking-widest uppercase">Pustakam Engine v2</div>
                </div>
            </div>
        </div>
    );
}

const features = [
    { title: 'Neural Generation', description: 'Advanced language models synthesize information into structured chapters.', icon: Sparkles },
    { title: 'Zero Data Leak', description: 'Your content and API keys never leave your browser. Privacy by design.', icon: Shield },
    { title: 'Universal Export', description: 'Seamlessly transition from screen to page with high-fidelity PDF and Markdown.', icon: Download },
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 selection:text-orange-200">
            {/* Minimalist Grid Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent pointer-events-none" />

            {/* Float Navigation */}
            <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'w-[90%] md:w-[600px]' : 'w-[95%] md:w-[800px]'}`}>
                <nav className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src="/white-logo.png" alt="P" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[11px] font-mono tracking-[0.3em] uppercase opacity-60 group-hover:opacity-100 transition-opacity hidden sm:block">Pustakam</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Pricing', 'Collection'].map((item) => (
                            <button key={item} className="text-[11px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="text-[11px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity hidden sm:block">Login</button>
                        <button
                            onClick={onGetStarted}
                            className="bg-white text-black text-[10px] font-mono tracking-widest uppercase px-5 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-all transform active:scale-95"
                        >
                            Start
                        </button>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden opacity-60 hover:opacity-100">
                            {menuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                {menuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:hidden animate-fade-in-down">
                        <nav className="flex flex-col gap-6">
                            {['Features', 'Pricing', 'Collection', 'Login'].map((item) => (
                                <button key={item} className="text-left text-lg font-medium opacity-60 hover:opacity-100 transition-opacity">
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-12 animate-subtle-fade">
                    <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-50">V2.0 is now live</span>
                </div>

                <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em] mb-12 animate-fade-in-up">
                    Synthesize ideas into<br />
                    <span className="text-orange-500 italic font-normal serif">Complete Knowledge.</span>
                </h1>

                <p className="max-w-xl text-lg md:text-xl text-white/40 leading-relaxed mb-12 animate-fade-in-up delay-100">
                    The professional engine for AI-generated books. Bring your own intelligence, we provide the architecture.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up delay-200">
                    <button
                        onClick={onGetStarted}
                        className="group bg-white text-black px-10 py-4 rounded-full font-medium text-lg hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
                    >
                        Create Your Book
                        <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="text-white/40 hover:text-white text-lg font-medium transition-colors border-b border-transparent hover:border-white/20 pb-1">
                        View Sample Library
                    </button>
                </div>

                {/* Mockup Display */}
                <div className="mt-32 w-full max-w-5xl mx-auto animate-subtle-fade delay-300">
                    <BookGenerationMockup />
                </div>
            </section>

            {/* Sparse Pricing */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-start gap-6">
                            <span className="text-[10px] font-mono tracking-widest uppercase opacity-40">Standard</span>
                            <div className="text-4xl font-medium tracking-tight">Free</div>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Experience the core engine. Perfect for academic research and personal projects.
                            </p>
                            <ul className="space-y-3">
                                {['3 books total', 'All AI models', 'PDF export'].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-xs text-white/40">
                                        <div className="w-1 h-1 rounded-full bg-orange-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={onGetStarted} className="w-full py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono tracking-widest uppercase transition-all">Get Started</button>
                        </div>

                        <div className="p-8 rounded-3xl bg-orange-500/[0.03] border border-orange-500/20 flex flex-col items-start gap-6 relative overflow-hidden group">
                            <div className="absolute top-4 right-4 bg-orange-500 text-black text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded-full">Popular</div>
                            <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400">Unlimited</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-medium tracking-tight">₹149</span>
                                <span className="text-sm opacity-40">/mo</span>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Remove all limits. Scale your knowledge production with priority engine access.
                            </p>
                            <ul className="space-y-3">
                                {['Unlimited generation', 'Full source control', 'Priority support'].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                                        <div className="w-1 h-1 rounded-full bg-orange-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={onGetStarted} className="w-full py-4 rounded-full bg-white text-black hover:bg-orange-500 hover:text-white text-[11px] font-mono tracking-widest uppercase transition-all">Subscribe</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collection Teaser */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
                    <div className="max-w-md">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 mb-4 block">Archive</span>
                        <h2 className="text-3xl font-medium tracking-tight mb-4 text-white">Public Library</h2>
                        <p className="text-white/40 text-sm leading-relaxed">
                            A curated selection of books synthesized by Pustakam. High fidelity, deep research.
                        </p>
                    </div>
                    <button className="text-[11px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 mb-2 group">
                        Explore Full Library
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { title: 'AI Ethics', color: 'bg-orange-500/[0.05]' },
                        { title: 'Data Structures', color: 'bg-white/[0.03]' },
                        { title: 'Linear Algebra', color: 'bg-white/[0.03]' },
                        { title: 'Organic Chemistry', color: 'bg-white/[0.03]' }
                    ].map((book, i) => (
                        <div key={i} className={`aspect-[3/4] rounded-24 ${book.color} border border-white/5 p-6 flex flex-col justify-end hover:border-white/20 transition-all cursor-pointer group`}>
                            <span className="text-[10px] font-mono tracking-widest uppercase opacity-20 mb-2">2026 Archive</span>
                            <h3 className="font-medium text-white/80 group-hover:text-white transition-colors">{book.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sparse Footer */}
            <footer className="py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <img src="/white-logo.png" alt="Pustakam" className="w-6 h-6 opacity-80" />
                            <span className="font-mono text-[12px] tracking-widest uppercase opacity-40">Pustakam Engine</span>
                        </div>
                        <p className="text-white/20 text-xs font-mono tracking-widest uppercase">© 2026 Crafted by Tanmay</p>
                    </div>

                    <div className="flex gap-12">
                        {['Twitter', 'GitHub', 'Discord'].map((social) => (
                            <button key={social} className="text-[11px] font-mono tracking-widest uppercase opacity-30 hover:opacity-100 transition-opacity">
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
