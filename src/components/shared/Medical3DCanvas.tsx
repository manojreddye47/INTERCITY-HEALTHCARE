import React, { useEffect, useRef, useState } from 'react';

interface Medical3DCanvasProps {
  className?: string;
  speedMultiplier?: number;
  themePreset?: 'azure' | 'emerald' | 'indigo';
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function Medical3DCanvas({ 
  className = '',
  speedMultiplier = 1,
  themePreset = 'azure'
}: Medical3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const speedRef = useRef(speedMultiplier);
  const themeRef = useRef(themePreset);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    themeRef.current = themePreset;
  }, [themePreset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / height) * 2 - 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isHovering = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 180,
        alpha: 0.9,
      });

      // Scatter particles near click
      particles.forEach((p) => {
        const dist = Math.hypot(p.x - clickX, p.y - clickY);
        if (dist < 160) {
          const angle = Math.atan2(p.y - clickY, p.x - clickX);
          p.vx += Math.cos(angle) * 3;
          p.vy += Math.sin(angle) * 3;
        }
      });
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
      parent.addEventListener('click', handleClick);
    }

    // Floating particles
    const particleCount = 55;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 400 + 50,
      size: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      baseColor: Math.random() > 0.5 ? 'cyan' : 'teal',
    }));

    // DNA Helix structure
    const helixNodes = 38;
    const helixRadius = 90;
    const helixHeight = 540;
    let angleOffset = 0;

    const render = () => {
      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Color Theme tokens
      const isEmerald = themeRef.current === 'emerald';
      const isIndigo = themeRef.current === 'indigo';

      const primaryGlow = isEmerald ? 'rgba(16, 185, 129, 0.22)' : isIndigo ? 'rgba(99, 102, 241, 0.22)' : 'rgba(14, 116, 144, 0.22)';
      const secondaryGlow = isEmerald ? 'rgba(5, 150, 105, 0.15)' : isIndigo ? 'rgba(67, 56, 202, 0.15)' : 'rgba(30, 58, 138, 0.15)';
      const primaryHex = isEmerald ? '#10b981' : isIndigo ? '#818cf8' : '#38bdf8';
      const secondaryHex = isEmerald ? '#34d399' : isIndigo ? '#c084fc' : '#2dd4bf';

      // Background ambient glow
      const radialGlow = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 50,
        height / 2 + mouseRef.current.y * 50,
        25,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      radialGlow.addColorStop(0, primaryGlow);
      radialGlow.addColorStop(0.5, secondaryGlow);
      radialGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Render interactive click ripples
      for (let r = ripplesRef.current.length - 1; r >= 0; r--) {
        const rip = ripplesRef.current[r];
        rip.radius += 4;
        rip.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${primaryHex}${Math.floor(rip.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2.5 * rip.alpha;
        ctx.stroke();

        if (rip.alpha < 0.03 || rip.radius > rip.maxRadius) {
          ripplesRef.current.splice(r, 1);
        }
      }

      // Render floating particle mesh
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + mouseRef.current.x * 0.3 * speedRef.current;
        p.y += p.vy + mouseRef.current.y * 0.3 * speedRef.current;

        // Friction back to baseline speed
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor === 'cyan' ? `${primaryHex}bb` : `${secondaryHex}bb`;
        ctx.shadowColor = primaryHex;
        ctx.shadowBlur = 9;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.22 * (1 - dist / 95)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render 3D Rotating DNA Helix
      angleOffset += 0.016 * speedRef.current;
      const centerX = width / 2 + mouseRef.current.x * 40;
      const centerY = height / 2 + mouseRef.current.y * 30;
      const startY = centerY - helixHeight / 2;

      interface StrandNode {
        x1: number;
        y1: number;
        z1: number;
        x2: number;
        y2: number;
        z2: number;
      }

      const pairs: StrandNode[] = [];

      for (let i = 0; i < helixNodes; i++) {
        const t = i / helixNodes;
        const currentY = startY + t * helixHeight;
        const currentAngle = angleOffset + t * Math.PI * 4;

        const x1 = centerX + Math.cos(currentAngle) * helixRadius;
        const z1 = Math.sin(currentAngle) * helixRadius;

        const x2 = centerX + Math.cos(currentAngle + Math.PI) * helixRadius;
        const z2 = Math.sin(currentAngle + Math.PI) * helixRadius;

        pairs.push({ x1, y1: currentY, z1, x2, y2: currentY, z2 });
      }

      pairs.forEach((pair) => {
        const fov = 360;
        const scale1 = fov / (fov + pair.z1);
        const scale2 = fov / (fov + pair.z2);

        const px1 = pair.x1;
        const py1 = pair.y1;
        const px2 = pair.x2;
        const py2 = pair.y2;

        const alphaRung = Math.min(1, Math.max(0.18, (pair.z1 + pair.z2 + 200) / 400));

        // Base pair rungs
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.lineTo(px2, py2);
        const grad = ctx.createLinearGradient(px1, py1, px2, py2);
        grad.addColorStop(0, `${primaryHex}${Math.floor(alphaRung * 220).toString(16).padStart(2, '0')}`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${alphaRung * 0.95})`);
        grad.addColorStop(1, `${secondaryHex}${Math.floor(alphaRung * 220).toString(16).padStart(2, '0')}`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.9 * Math.min(scale1, scale2);
        ctx.stroke();

        // Node 1 (Strand A)
        const radius1 = 4.8 * scale1;
        ctx.beginPath();
        ctx.arc(px1, py1, radius1, 0, Math.PI * 2);
        ctx.fillStyle = pair.z1 > 0 ? primaryHex : '#0369a1';
        ctx.shadowColor = primaryHex;
        ctx.shadowBlur = pair.z1 > 0 ? 14 : 4;
        ctx.fill();

        // Node 2 (Strand B)
        const radius2 = 4.8 * scale2;
        ctx.beginPath();
        ctx.arc(px2, py2, radius2, 0, Math.PI * 2);
        ctx.fillStyle = pair.z2 > 0 ? secondaryHex : '#0d9488';
        ctx.shadowColor = secondaryHex;
        ctx.shadowBlur = pair.z2 > 0 ? 14 : 4;
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      // Floating Medical Cross in 3D Space
      const crossSize = 30;
      const crossX = centerX + Math.sin(angleOffset * 0.8) * 115;
      const crossY = centerY - 190 + Math.cos(angleOffset * 0.8) * 32;
      ctx.save();
      ctx.translate(crossX, crossY);
      ctx.rotate(angleOffset * 0.55);
      ctx.fillStyle = `${primaryHex}55`;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.fillRect(-crossSize / 6, -crossSize / 2, crossSize / 3, crossSize);
      ctx.strokeRect(-crossSize / 6, -crossSize / 2, crossSize / 3, crossSize);
      ctx.fillRect(-crossSize / 2, -crossSize / 6, crossSize, crossSize / 3);
      ctx.strokeRect(-crossSize / 2, -crossSize / 6, crossSize, crossSize / 3);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.removeEventListener('click', handleClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block cursor-crosshair ${className}`}
    />
  );
}
