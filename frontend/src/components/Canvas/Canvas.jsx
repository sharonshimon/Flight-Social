import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';

export default function Canvas() {
  const canvasRef = useRef(null);
  const lastRef = useRef({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [stampMode, setStampMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const context = canvas.getContext('2d');
    context.scale(dpr, dpr);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#0284c7'; // sky blue
    context.lineWidth = 3;
    context.shadowColor = 'rgba(2,132,199,0.15)';
    context.shadowBlur = 2;
    setCtx(context);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top)
    };
  };

  const handlePointerDown = (e) => {
    if (!ctx) return;
    const p = getPos(e);
    if (stampMode) {
      // place a small plane emoji at the position
      drawStamp(p.x, p.y, '✈️');
      return;
    }
    setIsDrawing(true);
    lastRef.current = p;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || !ctx) return;
    const p = getPos(e);
    const last = lastRef.current;
    // simple smoothing using quadratic curve
    const midX = (last.x + p.x) / 2;
    const midY = (last.y + p.y) / 2;
    ctx.quadraticCurveTo(last.x, last.y, midX, midY);
    ctx.stroke();
    lastRef.current = p;
  };

  const handlePointerUp = () => {
    if (!ctx) return;
    setIsDrawing(false);
    ctx.closePath();
  };

  const drawStamp = (x, y, emoji) => {
    if (!ctx) return;
    // draw emoji centered
    const size = 18;
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y + 1);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
  };

  const toggleStamp = () => setStampMode((s) => !s);

  return (
    <div className="canvas-card canvas-flight">
      <div className="canvas-header">
        <h4>Travel Sketch <span className="plane-emoji">✈️</span></h4>
        <div className="canvas-actions">
          <button type="button" onClick={toggleStamp} className={`btn-stamp ${stampMode ? 'active' : ''}`}>{stampMode ? 'Stamp: ON' : 'Stamp: ✈️'}</button>
          <button type="button" onClick={clear} className="btn-clear">Clear</button>
        </div>
      </div>
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          className={`sketch-canvas ${stampMode ? 'stamp-mode' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <p className="canvas-hint">Draw a quick route or tap "Stamp" and place a ✈️ to mark a stop.</p>
    </div>
  );
}
