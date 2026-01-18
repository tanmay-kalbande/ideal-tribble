import React, { useState, useEffect, useRef } from 'react';
import { MoveRight } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onSubscribe?: () => void;
}

// Atmospheric Nebula Background using Canvas
const NebulaBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let clouds: Cloud[] = [];
        let stars: Star[] = [];

        interface Cloud {
            x: number;
            y: number;
            radius: number;
            color: string;
            dx: number;
            dy: number;
            opacity: number;
        }

        interface Star {
            x: number;
            y: number;
            radius: number;
            alpha: number;
            dx: number;
            dy: number;
        }

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            clouds = [];
            stars = [];

            // Create large nebula clouds
            for (let i = 0; i < 20; i++) { // Increased count for dense atmosphere
                clouds.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 300 + 200, // Large glowing blobs
                    color: i % 2 === 0 ? 'rgba(59, 130, 246)' : 'rgba(37, 99, 235)', // Blue-500 and Blue-600
                    dx: (Math.random() - 0.5) * 0.2, // Very slow movement
                    dy: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * 0.15 + 0.05 // Subtle opacity
                });
            }

            // Create dust/stars
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random() * 0.5 + 0.2,
                    dx: (Math.random() - 0.5) * 0.1,
                    dy: (Math.random() - 0.5) * 0.1
                });
            }
        };

        const animate = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Clouds (Nebula)
            clouds.forEach(cloud => {
                cloud.x += cloud.dx;
                cloud.y += cloud.dy;

                // Wrap around screen
                if (cloud.x - cloud.radius > canvas.width) cloud.x = -cloud.radius;
                if (cloud.x + cloud.radius < 0) cloud.x = canvas.width + cloud.radius;
                if (cloud.y - cloud.radius > canvas.height) cloud.y = -cloud.radius;
                if (cloud.y + cloud.radius < 0) cloud.y = canvas.height + cloud.radius;

                const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
                gradient.addColorStop(0, cloud.color.replace(')', `, ${cloud.opacity})`));
                gradient.addColorStop(1, 'transparent');

                ctx.globalCompositeOperation = 'screen'; // Additive blending for "glow"
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

            // Draw Dust/Stars
            ctx.globalCompositeOperation = 'source-over';
            stars.forEach(star => {
                star.x += star.dx;
                star.y += star.dy;

                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', init);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
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
                <div className="mb-12 transition-all duration-1000 animate-subtle-glow">
                    <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-medium tracking-[-0.03em] leading-none mb-4 text-white">
                        Pustakam
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-8 mb-16 animate-fade-in">
                    <button
                        onClick={onGetStarted}
                        className="bg-white text-black px-10 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        Initialize Engine
                    </button>

                    <div className="max-w-lg text-white/30 text-sm md:text-base leading-relaxed font-light tracking-wide px-4">
                        Pustakam synthesizes high-fidelity knowledge archives from your prompts.
                        Built for rapid exploration and deep academic research.
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
