import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Download,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Move
} from 'lucide-react';
import { sanitizeImageUrl } from '../utils/securityUtils';

interface LightboxModalProps {
  images: string[];
  initialIndex: number;
  title?: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  initialIndex,
  title,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const currentSrc = sanitizeImageUrl(images[currentIndex]) || '';

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetTransform();
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') resetTransform();
      if (images.length > 1) {
        if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.35, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.35, 0.5);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.5), 5);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetTransform();
    } else {
      setScale(2.2);
    }
  };

  const handleDownload = () => {
    const safeUrl = sanitizeImageUrl(currentSrc);
    if (!safeUrl) return;
    const link = document.createElement('a');
    link.href = safeUrl;
    link.rel = 'noopener noreferrer';
    link.download = `STD-screenshot-${currentIndex + 1}.png`;
    link.click();
  };

  if (!currentSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md select-none"
      dir="rtl"
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-white z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            תמונה {currentIndex + 1} מתוך {images.length}
          </span>
          {title && (
            <h3 className="text-sm md:text-base font-medium text-slate-200 truncate rtl-safe">
              {title}
            </h3>
          )}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 ml-3 bg-slate-800/70 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Move className="w-3.5 h-3.5 text-indigo-400" />
            <span>גלגלת עכבר או לחיצה כפולה לזום • גרירה להזזה</span>
          </div>

          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="הקטן תצוגה (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetTransform}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-indigo-300 min-w-[60px] text-center transition cursor-pointer"
            title="איפוס זום (100%)"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="הגדל תצוגה (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setScale(2.5)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium transition cursor-pointer"
            title="זום מהיר לקריאת טקסט מובייל קטן"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>זום מובייל (250%)</span>
          </button>

          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="סובב תמונה"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetTransform}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="אפס תצוגה"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="הורד תמונה"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 transition cursor-pointer"
            title="סגור (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Canvas */}
      <div
        className={`relative flex-1 flex items-center justify-center overflow-hidden ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) {
            onClose();
          }
        }}
      >
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
              }}
              className="absolute right-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700 shadow-xl transition cursor-pointer"
              title="תמונה קודמת"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % images.length);
              }}
              className="absolute left-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white border border-slate-700 shadow-xl transition cursor-pointer"
              title="תמונה הבאה"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        <img
          src={currentSrc}
          alt={title || 'צילום מסך'}
          draggable={false}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
          className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Bottom Thumbnail Strip if multiple screenshots */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-900/90 border-t border-slate-800 z-20 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 transition shrink-0 cursor-pointer bg-slate-950 ${
                idx === currentIndex
                  ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105'
                  : 'border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
