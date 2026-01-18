import React, { useState, useEffect, useRef } from 'react';
import { MoveRight } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// High-Fidelity Atmospheric Background using Canvas
const NebulaBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Grain/Dust Texture Generator
        const createGrain = (width: number, height: number) => {
            const grainCanvas = document.createElement('canvas');
            grainCanvas.width = 256;
            grainCanvas.height = 256;
            const grainCtx = grainCanvas.getContext('2d')!;
            const imageData = grainCtx.createImageData(256, 256);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const val = Math.random() * 255;
                imageData.data[i] = val;
                imageData.data[i + 1] = val;
                imageData.data[i + 2] = val;
                imageData.data[i + 3] = 12; // Very faint dust
            }
            grainCtx.putImageData(imageData, 0, 0);
            return grainCtx.createPattern(grainCanvas, 'repeat')!;
        };

        const grainPattern = createGrain(canvas.width, canvas.height);

        const render = () => {
            time += 0.002;
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. Draw "Dust/Grain" static layer
            ctx.fillStyle = grainPattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Multi-layered light streaks ("Wispy" effect)
            ctx.globalCompositeOperation = 'screen';

            const drawStreak = (x: number, y: number, w: number, h: number, rot: number, color: string, opacity: number) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rot);
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
                grad.addColorStop(0, color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.globalAlpha = opacity;
                ctx.scale(2.5, 0.4); // Stretches the radial gradient into a streak
                ctx.beginPath();
                ctx.arc(0, 0, w, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            };

            const centerX = canvas.width * 0.75;
            const centerY = canvas.height * 0.45;

            // Deep background glow
            drawStreak(centerX, centerY, 800, 800, time * 0.1, 'rgba(30, 64, 175, 0.4)', 0.4);

            // Dynamic wisps
            for (let i = 0; i < 3; i++) {
                const offset = i * 1.5;
                const wx = centerX + Math.sin(time + offset) * 150;
                const wy = centerY + Math.cos(time * 0.8 + offset) * 100;
                const wWidth = 400 + Math.sin(time * 0.5 + offset) * 100;
                drawStreak(wx, wy, wWidth, 300, (time + offset) * 0.2, 'rgba(59, 130, 246, 0.25)', 0.5);
            }

            // High intensity core wisp
            const coreX = centerX + Math.sin(time * 1.2) * 50;
            const coreY = centerY + Math.cos(time * 0.7) * 40;
            drawStreak(coreX, coreY, 600, 200, -time * 0.15, 'rgba(147, 197, 253, 0.3)', 0.4);

            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" />;
};

const LandingPage = ({ onLogin, onGetStarted }: LandingPageProps) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden font-sans">
            <NebulaBackground />

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
                    <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-extralight tracking-[-0.05em] leading-[0.9] mb-4 text-white drop-shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        Pustakam
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-10 mb-16 animate-fade-in">
                    <button
                        onClick={onGetStarted}
                        className="group relative bg-white/5 backdrop-blur-3xl text-white border border-white/10 px-12 py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase overflow-hidden transition-all hover:border-white/30 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 group-hover:text-black transition-colors duration-300">Initialize Engine</span>
                    </button>

                    <div className="max-w-xl text-white/20 text-xs md:text-sm leading-relaxed font-light tracking-[0.05em] px-4 uppercase">
                        Synthesizing high-fidelity knowledge archives. <br className="hidden md:block" />
                        Engineered for deep academic research.
                    </div>
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
