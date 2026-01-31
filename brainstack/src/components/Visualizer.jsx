
import React, { useEffect, useRef } from 'react';

export const Visualizer = ({ isActive, color = '#1a4d2e' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    const bars = 24;
    const barWidth = canvas.width / bars;
    const heights = new Array(bars).fill(2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        const target = isActive ? Math.random() * canvas.height * 0.8 + 5 : 2;
        heights[i] += (target - heights[i]) * 0.2;
        
        const x = i * barWidth;
        const y = (canvas.height - heights[i]) / 2;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + heights[i]);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#ffcc00');
        
        ctx.fillStyle = gradient;
        const radius = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x + 2, y, barWidth - 4, heights[i], radius);
        } else {
            ctx.rect(x + 2, y, barWidth - 4, heights[i]);
        }
        ctx.fill();
      }
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, color]);

  return (
    <div className="relative w-full">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={80} 
        className={`w-full h-20 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}
      />
    </div>
  );
};
