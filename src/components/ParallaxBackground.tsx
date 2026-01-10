// src/components/ParallaxBackground.tsx - Interactive Parallax Particle Background
import React, { useEffect, useRef, useCallback } from 'react';

interface ParallaxBackgroundProps {
    theme: 'light' | 'dark';
}

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    color: string;
    speed: number;
    opacity: number;
    layer: number; // 0 = far (slow), 1 = mid, 2 = near (fast)
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const animationRef = useRef<number>(0);
    const timeRef = useRef(0);

    // Theme-aware color palettes
    const getColors = useCallback(() => {
        if (theme === 'light') {
            return [
                'rgba(249, 115, 22, 0.6)',   // orange
                'rgba(251, 191, 36, 0.5)',   // amber
                'rgba(234, 88, 12, 0.4)',    // dark orange
                'rgba(156, 163, 175, 0.4)',  // grey
                'rgba(209, 213, 219, 0.3)',  // light grey
                'rgba(59, 130, 246, 0.3)',   // blue accent
            ];
        }
        return [
            'rgba(249, 115, 22, 0.8)',   // orange
            'rgba(251, 191, 36, 0.7)',   // amber
            'rgba(234, 88, 12, 0.6)',    // dark orange
            'rgba(107, 114, 128, 0.5)',  // grey
            'rgba(75, 85, 99, 0.4)',     // dark grey
            'rgba(239, 68, 68, 0.3)',    // red accent
        ];
    }, [theme]);

    // Initialize particles
    const initParticles = useCallback((width: number, height: number) => {
        const colors = getColors();
        const particles: Particle[] = [];
        const particleCount = Math.min(150, Math.floor((width * height) / 8000));

        for (let i = 0; i < particleCount; i++) {
            const layer = Math.floor(Math.random() * 3); // 0, 1, or 2
            const x = Math.random() * width;
            const y = Math.random() * height;

            particles.push({
                x,
                y,
                baseX: x,
                baseY: y,
                size: layer === 0 ? 1 : layer === 1 ? 1.5 : 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 0.2 + layer * 0.3, // Far particles move slower
                opacity: 0.3 + Math.random() * 0.7,
                layer,
            });
        }

        particlesRef.current = particles;
    }, [getColors]);

    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        timeRef.current += 0.016; // ~60fps

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw gradient background glow
        if (theme === 'dark') {
            // Top glow
            const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.3);
            topGradient.addColorStop(0, 'rgba(249, 115, 22, 0.05)');
            topGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = topGradient;
            ctx.fillRect(0, 0, width, height * 0.3);

            // Bottom glow
            const bottomGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
            bottomGradient.addColorStop(0, 'transparent');
            bottomGradient.addColorStop(1, 'rgba(251, 191, 36, 0.03)');
            ctx.fillStyle = bottomGradient;
            ctx.fillRect(0, height * 0.7, width, height * 0.3);
        }

        // Update and draw particles
        const particles = particlesRef.current;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const scroll = scrollRef.current;

        for (const particle of particles) {
            // Parallax scroll effect based on layer
            const scrollOffset = scroll * particle.speed * 0.1;

            // Mouse interaction - subtle displacement
            const dx = mx - particle.baseX;
            const dy = my - particle.baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;

            let pushX = 0;
            let pushY = 0;

            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 30 * particle.speed;
                pushX = -(dx / distance) * force;
                pushY = -(dy / distance) * force;
            }

            // Subtle floating animation
            const floatX = Math.sin(timeRef.current * particle.speed + particle.baseX * 0.01) * 2;
            const floatY = Math.cos(timeRef.current * particle.speed + particle.baseY * 0.01) * 2;

            // Calculate final position
            particle.x = particle.baseX + pushX + floatX;
            particle.y = particle.baseY + pushY + floatY - scrollOffset;

            // Wrap particles vertically
            if (particle.y < -10) {
                particle.y = height + 10;
                particle.baseY = particle.y + scrollOffset;
            } else if (particle.y > height + 10) {
                particle.y = -10;
                particle.baseY = particle.y + scrollOffset;
            }

            // Shimmer effect
            const shimmer = 0.7 + Math.sin(timeRef.current * 2 + particle.baseX) * 0.3;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${particle.opacity * shimmer})`);
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(animate);
    }, [theme]);

    // Setup canvas and event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(canvas.width, canvas.height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = () => {
            const scrollElement = document.getElementById('main-scroll-area');
            scrollRef.current = scrollElement?.scrollTop || window.scrollY;
        };

        // Initial setup
        handleResize();

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

        // Event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const scrollElement = document.getElementById('main-scroll-area');
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll, { passive: true });
        }
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, [animate, initParticles]);

    // Reinitialize particles when theme changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            initParticles(canvas.width, canvas.height);
        }
    }, [theme, initParticles]);

    return (
        <div className="parallax-background">
            <canvas
                ref={canvasRef}
                className="parallax-canvas"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
};

export default ParallaxBackground;
