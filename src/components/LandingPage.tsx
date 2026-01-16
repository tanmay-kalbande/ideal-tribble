// src/components/LandingPage.tsx - Frans Hals Museum Style Multi-Section Landing
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronRight, ChevronLeft, BookOpen, Sparkles, Zap, Shield, Globe, Download, Check, BookMarked, ArrowRight, Loader2, Star, Users, Clock, Award } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

type ActiveSection = 'home' | 'collection' | 'features' | 'pricing';

// Book Generation Mockup - BIGGER/BOLDER with typing animation
function BookGenerationMockup() {
    const [currentModule, setCurrentModule] = useState(1);
    const [progress, setProgress] = useState(10);
    const [wordCount, setWordCount] = useState(3200);
    const [typedText, setTypedText] = useState('');
    const [pixels, setPixels] = useState<Array<{ color: string; opacity: string }>>([]);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [charIndex, setCharIndex] = useState(0);

    const chapters = [
        { title: 'Introduction to AI Ethics', text: '# Introduction to AI Ethics\n\nArtificial Intelligence has transformed modern technology in unprecedented ways. From healthcare diagnostics to autonomous vehicles, AI systems are reshaping how we interact with the world around us. The ethical implications of these systems demand careful consideration as they increasingly influence critical decisions affecting human lives.\n\n## Key Concepts\n\nEthical AI encompasses principles of fairness, transparency, accountability, and privacy.' },
        { title: 'Understanding Algorithmic Bias', text: '# Understanding Algorithmic Bias\n\nAlgorithmic bias occurs when machine learning systems produce systematically prejudiced results. These biases can emerge from training data, feature selection, or model architecture choices. Understanding the root causes is essential for building fair systems.\n\n## Sources of Bias\n\nHistorical bias reflects past inequalities embedded in training data. Representation bias occurs when certain groups are underrepresented.' },
        { title: 'Fairness in Machine Learning', text: '# Fairness in Machine Learning\n\nDefining fairness in ML systems requires careful consideration of multiple stakeholder perspectives. Statistical parity, equal opportunity, and calibration represent different fairness criteria that may sometimes conflict with each other.\n\n## Fairness Metrics\n\nDemographic parity ensures equal positive rates across groups. Equalized odds requires equal true positive and false positive rates.' },
    ];

    const currentChapter = chapters[(currentModule - 1) % chapters.length];

    useEffect(() => {
        const moduleInterval = setInterval(() => {
            setCurrentModule((m) => {
                const nextModule = m >= 10 ? 1 : m + 1;
                setCharIndex(0);
                setTypedText('');
                setProgress(nextModule * 10);
                setWordCount(3200 + (nextModule - 1) * 1200 + Math.floor(Math.random() * 500));
                return nextModule;
            });
        }, 5000);
        return () => clearInterval(moduleInterval);
    }, []);

    useEffect(() => {
        const fullText = currentChapter.text;
        const typeInterval = setInterval(() => {
            setCharIndex((prev) => {
                if (prev < fullText.length) {
                    setTypedText(fullText.substring(0, prev + 1));
                    return prev + 1;
                }
                return prev;
            });
        }, 8);
        return () => clearInterval(typeInterval);
    }, [currentModule, currentChapter.text]);

    useEffect(() => {
        if (textContainerRef.current) {
            textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
        }
    }, [typedText]);

    useEffect(() => {
        const colors = ['bg-orange-500', 'bg-yellow-500', 'bg-amber-600', 'bg-red-500', 'bg-gray-600', 'bg-gray-700'];
        const generatePixels = () => {
            const totalPixels = 150;
            const newPixels = Array(totalPixels).fill(0).map(() => ({
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() > 0.4 ? 'opacity-100' : 'opacity-40',
            }));
            setPixels(newPixels);
        };
        generatePixels();
        const interval = setInterval(generatePixels, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        // BIGGER MOCKUP
        <div className="relative w-full max-w-lg mx-auto">
            <div className="absolute -inset-6 bg-orange-500/20 blur-3xl rounded-3xl" />
            <div className="relative bg-[#0f0f15] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-orange-500/20 rounded-xl border border-orange-500/30">
                            <BookOpen size={26} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-white">Generating Chapters...</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-orange-300 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full">{progress}%</span>
                                    <span className="text-sm font-mono text-gray-400">{wordCount.toLocaleString()} words</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">Module {currentModule} of 10</div>
                        </div>
                    </div>
                    <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden mt-4 mb-4">
                        <div className="h-full rounded-full transition-all duration-150" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f97316, #fbbf24)' }} />
                    </div>
                </div>
                <div ref={textContainerRef} className="mx-6 p-5 bg-[#0a0a0f] border border-white/5 rounded-xl mb-5 h-32 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={16} className="text-amber-400" />
                        <span className="text-white font-semibold">{currentChapter.title}</span>
                    </div>
                    <div className="text-sm text-gray-500 leading-relaxed font-mono whitespace-pre-wrap">
                        {typedText}<span className="inline-block w-2 h-4 bg-orange-400 animate-pulse ml-0.5" />
                    </div>
                </div>
                <div className="mx-6 mb-5">
                    <div className="flex flex-wrap gap-1 h-8 overflow-hidden">
                        {pixels.map((p, i) => <div key={i} className={`w-2 h-2 rounded-sm ${p.color} ${p.opacity} transition-opacity duration-150`} />)}
                    </div>
                </div>
                <div className="px-6 pb-5 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 size={16} className="text-orange-500 animate-spin" />
                            <span>41s remaining</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium text-gray-400">Cancel</button>
                            <button className="px-5 py-2 bg-orange-600 rounded-lg text-white text-sm font-semibold">Pause</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sample books
const sampleBooks = [
    { id: 1, title: 'Introduction To AI Fundamentals', pdf: '/Introduction_To_Ai_Fundamentals_2026-01-04.pdf', cover: 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)', year: '2026' },
    { id: 2, title: 'Introduction To Databases And SQL', pdf: '/Introduction_To_Databases_And_Sql_2026-01-08.pdf', cover: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', year: '2026' },
    { id: 3, title: 'Data Science: A Practical Guide', pdf: '/Data_Science_Work_A_Practical_Guide_To_Roles_And_P_2025-11-06.pdf', cover: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', year: '2025' },
    { id: 4, title: 'ML Lifecycle: End-to-End Guide', pdf: '/Master_The_End-to-end_Lifecycle_Of_Building_And_De_2025-11-24.pdf', cover: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', year: '2025' },
    { id: 5, title: 'Understanding Earth: Our Living Planet', pdf: '/Understanding_Earth_Our_Living_Planet_2025-11-06.pdf', cover: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', year: '2025' },
    { id: 6, title: 'Code Craft: Building Logic One Line At A Time', pdf: '/Code_Craft_Building_Logic_One_Line_At_A_Time_2025-10-29 (4).pdf', cover: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', year: '2025' },
    { id: 7, title: 'The Art Of Calm: A Journey To Inner Peace', pdf: '/The_Art_Of_Calm_A_Journey_To_Inner_Peace_2025-10-29.pdf', cover: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', year: '2025' },
];

const features = [
    { icon: Sparkles, title: 'AI-Powered Generation', description: 'Transform any topic into comprehensive, well-structured books using state-of-the-art AI models.', color: 'text-orange-400' },
    { icon: BookOpen, title: 'Complete Books', description: 'Generate full books with chapters, not just snippets. Perfect for learning and reference.', color: 'text-yellow-400' },
    { icon: Zap, title: 'Multiple AI Models', description: 'Choose from Google Gemini, Mistral, Groq, Cerebras and more. Use your own API keys.', color: 'text-amber-400' },
    { icon: Shield, title: 'Privacy First', description: 'Your data stays on your device. API keys stored locally, never on our servers.', color: 'text-red-400' },
    { icon: Globe, title: 'Works Offline', description: 'Install as a PWA and access your books anytime, even without internet.', color: 'text-orange-300' },
    { icon: Download, title: 'Export Anywhere', description: 'Download your books as PDF or Markdown. Read on any device.', color: 'text-amber-300' },
];

const pricingPlans = [
    { name: 'Free', price: '₹0', description: 'Try the platform', features: ['3 books total', 'All AI models', 'PDF export', 'Offline access'], popular: false },
    { name: 'Monthly', price: '₹149', period: '/month', description: 'For regular creators', features: ['Unlimited books', 'All AI models', 'PDF & Markdown export', 'Priority support'], popular: true },
    { name: 'Yearly', price: '₹1,499', period: '/year', description: 'Best value', features: ['Everything in Monthly', '2 months free', 'Early access to features', 'Dedicated support'], popular: false, savings: '₹289 saved' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGetStarted, onSubscribe }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<ActiveSection>('home');
    const scrollRef = useRef<HTMLDivElement>(null);

    const navigateTo = (section: ActiveSection) => {
        setActiveSection(section);
        setMenuOpen(false);
    };

    const handleSubscribe = () => {
        if (onSubscribe) {
            onSubscribe();
        } else {
            onLogin();
        }
    };

    const scrollBooks = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* ===== HEADER ===== */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('home')}>
                        <img src="/white-logo.png" alt="Pustakam" className="w-10 h-10" />
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold tracking-tight">PUSTAKAM</h1>
                            <p className="text-xs text-white/50 -mt-0.5">AI Book Engine</p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        {(['home', 'features', 'collection', 'pricing'] as const).map((section) => (
                            <button
                                key={section}
                                onClick={() => navigateTo(section)}
                                className={`hover:text-orange-400 transition-colors uppercase ${activeSection === section ? 'text-orange-400' : ''}`}
                            >
                                {section.toUpperCase()}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button onClick={onLogin} className="hidden sm:block px-4 py-2 text-sm font-medium hover:text-orange-400 transition-colors">Login</button>
                        <button onClick={onGetStarted} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm">Get Started</button>
                        <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg"><Menu size={24} /></button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE MENU ===== */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col p-6">
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-4">
                            <img src="/white-logo.png" alt="Pustakam" className="w-10 h-10" />
                            <span className="text-xl font-bold">PUSTAKAM</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X size={28} /></button>
                    </div>
                    <nav className="flex-1 flex flex-col justify-center gap-4">
                        {(['home', 'features', 'collection', 'pricing'] as const).map((section) => (
                            <button key={section} onClick={() => navigateTo(section)} className={`text-left text-4xl md:text-5xl font-bold hover:text-orange-400 transition-all hover:translate-x-2 uppercase ${activeSection === section ? 'text-orange-400' : ''}`}>
                                {section}
                            </button>
                        ))}
                    </nav>
                    <div className="border border-orange-500/30 rounded-lg p-6 mt-8">
                        <p className="text-sm font-semibold text-orange-400 mb-4">QUICK ACCESS</p>
                        <div className="space-y-2 text-sm text-white/60">
                            <p className="hover:text-white cursor-pointer" onClick={onGetStarted}>Create Your Book</p>
                            <p className="hover:text-white cursor-pointer" onClick={onLogin}>Login to Account</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== HERO SECTION (REDUCED SIZE) ===== */}
            <section className="pt-24 min-h-[70vh] flex items-center px-6 md:px-12 pb-8">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center w-full">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-5">
                            <Star size={14} />
                            <span>AI-Powered Book Generation</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Transform Ideas Into
                            <span className="block text-orange-400">Complete Books</span>
                        </h1>
                        <p className="text-lg text-gray-400 mb-6 max-w-lg">
                            Generate comprehensive, well-structured books on any topic using AI. Bring your own API keys and create unlimited knowledge.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={onGetStarted} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2">
                                Start Creating Free <ArrowRight size={18} />
                            </button>
                            <button onClick={() => navigateTo('features')} className="text-gray-400 hover:text-white px-6 py-3 font-medium transition-colors border border-white/10 rounded-lg hover:border-white/20">
                                Learn More
                            </button>
                        </div>
                        <div className="mt-10 flex items-center gap-6">
                            <div><div className="text-xl font-bold">5+</div><div className="text-xs text-gray-500">AI Models</div></div>
                            <div className="w-px h-8 bg-white/10" />
                            <div><div className="text-xl font-bold">100%</div><div className="text-xs text-gray-500">Privacy</div></div>
                            <div className="w-px h-8 bg-white/10" />
                            <div><div className="text-xl font-bold">Free</div><div className="text-xs text-gray-500">To Start</div></div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <BookGenerationMockup />
                    </div>
                </div>
            </section>

            {/* ===== CONTENT SECTION ===== */}

            {/* HOME - More Content */}
            {activeSection === 'home' && (
                <>
                    {/* Stats Section */}
                    <section className="py-16 px-6 md:px-12">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-6 rounded-2xl bg-white/[0.02]">
                                    <Users className="mx-auto mb-3 text-orange-400" size={28} />
                                    <div className="text-2xl font-bold">1000+</div>
                                    <div className="text-sm text-gray-500">Active Users</div>
                                </div>
                                <div className="text-center p-6 rounded-2xl bg-white/[0.02]">
                                    <BookOpen className="mx-auto mb-3 text-yellow-400" size={28} />
                                    <div className="text-2xl font-bold">5000+</div>
                                    <div className="text-sm text-gray-500">Books Generated</div>
                                </div>
                                <div className="text-center p-6 rounded-2xl bg-white/[0.02]">
                                    <Clock className="mx-auto mb-3 text-amber-400" size={28} />
                                    <div className="text-2xl font-bold">&lt;5 min</div>
                                    <div className="text-sm text-gray-500">Avg Generation</div>
                                </div>
                                <div className="text-center p-6 rounded-2xl bg-white/[0.02]">
                                    <Award className="mx-auto mb-3 text-red-400" size={28} />
                                    <div className="text-2xl font-bold">4.9/5</div>
                                    <div className="text-sm text-gray-500">User Rating</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="py-16 px-6 md:px-12">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">HOW IT WORKS</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 font-bold text-xl">1</div>
                                    <h3 className="font-semibold mb-2">Choose Your Topic</h3>
                                    <p className="text-sm text-gray-500">Enter any topic or idea you want to explore in depth.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 font-bold text-xl">2</div>
                                    <h3 className="font-semibold mb-2">AI Generates</h3>
                                    <p className="text-sm text-gray-500">Our AI creates structured chapters with comprehensive content.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 font-bold text-xl">3</div>
                                    <h3 className="font-semibold mb-2">Read & Export</h3>
                                    <p className="text-sm text-gray-500">Read in-app or export as PDF/Markdown for offline access.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="py-16 px-6 md:px-12">
                        <div className="max-w-3xl mx-auto text-center">
                            <BookMarked className="w-14 h-14 text-orange-400 mx-auto mb-5" />
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Your First Book?</h2>
                            <p className="text-gray-400 mb-6">Join creators using AI to generate comprehensive books on any topic.</p>
                            <button onClick={onGetStarted} className="bg-white text-black px-7 py-3.5 font-semibold rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                                Get Started Free <ArrowRight size={18} />
                            </button>
                        </div>
                    </section>
                </>
            )}

            {/* FEATURES */}
            {activeSection === 'features' && (
                <section className="py-16 px-6 md:px-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">WHY PUSTAKAM?</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">Powerful features to help you generate, customize, and share your AI-created books.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.color}`}><Icon size={22} /></div>
                                        <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-14">
                            <button onClick={onGetStarted} className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 font-semibold rounded-lg inline-flex items-center gap-2">
                                Start Creating <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* COLLECTION */}
            {activeSection === 'collection' && (
                <section className="py-16 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">OUR HIGHLIGHTS</h2>
                                <p className="text-gray-500">Sample books generated by our AI engine • Click to view PDF</p>
                            </div>
                            <div className="hidden md:flex gap-2">
                                <button onClick={() => scrollBooks('left')} className="p-3 border border-white/10 rounded-lg hover:bg-white/5"><ChevronLeft size={20} /></button>
                                <button onClick={() => scrollBooks('right')} className="p-3 border border-white/10 rounded-lg hover:bg-white/5"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
                            {sampleBooks.map((book) => (
                                <a key={book.id} href={book.pdf} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]" style={{ aspectRatio: '3/4' }}>
                                    <div className="absolute inset-0" style={{ background: book.cover }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-xs text-white/50 mb-1">AI Generated • {book.year}</p>
                                        <h3 className="font-semibold text-sm lg:text-base leading-tight">{book.title}</h3>
                                    </div>
                                </a>
                            ))}
                            <div onClick={onGetStarted} className="relative rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-orange-500/30 hover:border-orange-500/50 flex items-center justify-center bg-orange-500/5 hover:bg-orange-500/10" style={{ aspectRatio: '3/4' }}>
                                <div className="text-center p-4">
                                    <Sparkles className="mx-auto mb-3 text-orange-400" size={28} />
                                    <h3 className="font-semibold text-sm">Create Your Book</h3>
                                    <p className="text-xs text-gray-500 mt-1">Generate with AI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PRICING */}
            {activeSection === 'pricing' && (
                <section className="py-16 px-6 md:px-12">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">SIMPLE PRICING</h2>
                            <p className="text-gray-400">You bring your own API keys. We provide the platform. No hidden costs.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-5">
                            {pricingPlans.map((plan, i) => (
                                <div key={i} className={`relative p-5 rounded-2xl ${plan.popular ? 'bg-orange-500/5 border border-orange-500/30' : 'bg-white/[0.02]'}`}>
                                    {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">Most Popular</div>}
                                    {plan.savings && <div className="absolute -top-3 right-4 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">{plan.savings}</div>}
                                    <div className="mb-5"><h3 className="text-lg font-bold mb-1">{plan.name}</h3><p className="text-sm text-gray-500">{plan.description}</p></div>
                                    <div className="mb-5"><span className="text-3xl font-bold">{plan.price}</span>{plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}</div>
                                    <ul className="space-y-2.5 mb-6">{plan.features.map((f, j) => <li key={j} className="flex items-center gap-2 text-sm"><Check size={16} className="text-amber-400" /><span className="text-gray-400">{f}</span></li>)}</ul>
                                    <button onClick={plan.price === '₹0' ? onGetStarted : handleSubscribe} className={`w-full py-2.5 rounded-lg font-medium text-sm ${plan.popular ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>{plan.price === '₹0' ? 'Get Started Free' : 'Subscribe'}</button>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-10">💡 All plans require your own API keys from Google, Mistral, Groq, or Cerebras (free tiers available)</p>
                    </div>
                </section>
            )}

            {/* ===== FOOTER ===== */}
            <footer className="py-10 px-6 md:px-12 bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/white-logo.png" alt="Pustakam" className="w-8 h-8" />
                                <span className="font-bold">PUSTAKAM</span>
                            </div>
                            <p className="text-sm text-gray-500">AI-powered book generation engine.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-4">EXPLORE</h4>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p className="hover:text-white cursor-pointer" onClick={onGetStarted}>Create Book</p>
                                <p className="hover:text-white cursor-pointer" onClick={() => navigateTo('collection')}>Browse Library</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-4">SUPPORT</h4>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p className="hover:text-white cursor-pointer">Help Center</p>
                                <p className="hover:text-white cursor-pointer">Contact</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-4">STAY INFORMED</h4>
                            <div className="flex flex-col gap-3">
                                <input type="email" placeholder="your@email.com" className="bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-orange-400" />
                                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <p>© 2026 Pustakam. Created by Tanmay Kalbande</p>
                        <div className="flex gap-6">
                            <span className="hover:text-white cursor-pointer">Terms</span>
                            <span className="hover:text-white cursor-pointer">Privacy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
