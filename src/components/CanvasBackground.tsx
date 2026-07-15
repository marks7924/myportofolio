'use client';

import React, { useEffect, useRef } from 'react';

interface CanvasBackgroundProps {
  type?: 'particles' | 'waves' | 'none';
}

export default function CanvasBackground({ type = 'particles' }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || type === 'none') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse movement tracking
    const mouse = { x: -1000, y: -1000, radius: 150 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // ----------------------------------------------------
    // Particles setup
    // ----------------------------------------------------
    const particleCount = Math.min(80, Math.floor((width * height) / 15000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    if (type === 'particles') {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    }

    // ----------------------------------------------------
    // Waves variables
    // ----------------------------------------------------
    let waveOffset = 0;

    // ----------------------------------------------------
    // Loop
    // ----------------------------------------------------
    const tick = () => {
      if (!ctx || !canvas) return;

      // Determine theme from document class
      const isDark = !document.documentElement.classList.contains('light');
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (type === 'particles') {
        // Draw and update particles
        ctx.fillStyle = isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(124, 58, 237, 0.2)';
        ctx.strokeStyle = isDark ? 'rgba(167, 139, 250, 0.05)' : 'rgba(124, 58, 237, 0.05)';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Boundary checks
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Connect particles to mouse
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.15;
            ctx.strokeStyle = isDark 
              ? `rgba(167, 139, 250, ${alpha})` 
              : `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }

          // Connect particles to each other
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dxP = p.x - p2.x;
            const dyP = p.y - p2.y;
            const distP = Math.sqrt(dxP * dxP + dyP * dyP);

            if (distP < 100) {
              const alpha = (1 - distP / 100) * 0.05;
              ctx.strokeStyle = isDark 
                ? `rgba(167, 139, 250, ${alpha})` 
                : `rgba(124, 58, 237, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } else if (type === 'waves') {
        // Draw fluid flowing waves
        waveOffset += 0.005;
        const waveCount = 3;
        ctx.lineWidth = 1.5;

        for (let w = 0; w < waveCount; w++) {
          const factor = (w + 1) * 0.5;
          const alpha = (0.05 / factor);
          ctx.strokeStyle = isDark 
            ? `rgba(139, 92, 246, ${alpha})` 
            : `rgba(99, 102, 241, ${alpha})`;
          
          ctx.beginPath();
          for (let x = 0; x < width; x += 10) {
            const sine = Math.sin(x * 0.002 * factor + waveOffset) * 80 * factor;
            const cosine = Math.cos(x * 0.001 * factor - waveOffset) * 30;
            const y = height * 0.5 + sine + cosine;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
