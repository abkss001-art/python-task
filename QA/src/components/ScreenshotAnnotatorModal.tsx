import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Check,
  Undo2,
  RotateCcw,
  PenTool,
  Square,
  Circle,
  MoveUpRight,
  EyeOff
} from 'lucide-react';

interface ScreenshotAnnotatorModalProps {
  imageSrc: string;
  onSave: (annotatedDataUrl: string) => void;
  onCancel: () => void;
}

type ToolType = 'arrow' | 'rect' | 'circle' | 'pen' | 'blur';

const COLORS = [
  { name: 'אדום', value: '#ef4444' },
  { name: 'צהוב', value: '#eab308' },
  { name: 'ירוק', value: '#10b981' },
  { name: 'כחול', value: '#3b82f6' }
];

export const ScreenshotAnnotatorModal: React.FC<ScreenshotAnnotatorModalProps> = ({
  imageSrc,
  onSave,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>('arrow');
  const [color, setColor] = useState<string>('#ef4444');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotBeforeDrag = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const initial = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initial]);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    const coords = getCanvasCoords(e);
    setStartPos(coords);
    setIsDrawing(true);
    snapshotBeforeDrag.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(4, Math.round(canvas.width / 220));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    strokeWidth: number
  ) => {
    const headLen = strokeWidth * 4.2;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLen * Math.cos(angle - Math.PI / 6),
      toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLen * Math.cos(angle + Math.PI / 6),
      toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const strokeWidth = Math.max(4, Math.round(canvas.width / 220));

    if (tool === 'pen') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      return;
    }

    if (snapshotBeforeDrag.current) {
      ctx.putImageData(snapshotBeforeDrag.current, 0, 0);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const w = coords.x - startPos.x;
    const h = coords.y - startPos.y;

    if (tool === 'rect') {
      ctx.strokeRect(startPos.x, startPos.y, w, h);
    } else if (tool === 'circle') {
      ctx.beginPath();
      ctx.ellipse(
        startPos.x + w / 2,
        startPos.y + h / 2,
        Math.abs(w / 2),
        Math.abs(h / 2),
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    } else if (tool === 'arrow') {
      drawArrow(ctx, startPos.x, startPos.y, coords.x, coords.y, strokeWidth);
    } else if (tool === 'blur') {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(startPos.x, startPos.y, w, h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(startPos.x, startPos.y, w, h);
      ctx.restore();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextSnap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev, nextSnap]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = history.slice(0, -1);
    const lastImage = nextHistory[nextHistory.length - 1];
    ctx.putImageData(lastImage, 0, 0);
    setHistory(nextHistory);
  };

  const handleReset = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initial = history[0];
    ctx.putImageData(initial, 0, 0);
    setHistory([initial]);
  };

  const handleSaveAnnotated = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let out = canvas.toDataURL('image/webp', 0.88);
    if (out.length > 750_000) {
      out = canvas.toDataURL('image/jpeg', 0.82);
    }
    onSave(out);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-sm p-3 sm:p-5"
      dir="rtl"
    >
      {/* Top Toolbar */}
      <div className="max-w-5xl w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTool('arrow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tool === 'arrow'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MoveUpRight className="w-4 h-4" />
            <span>חץ</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('rect')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tool === 'rect'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>מסגרת</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('circle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tool === 'circle'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Circle className="w-4 h-4" />
            <span>עיגול</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('pen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tool === 'pen'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>טוש חופשי</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('blur')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tool === 'blur'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>הסתרה / השחרה</span>
          </button>

          {/* Color Picker */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-700 mr-1">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-6 h-6 rounded-full transition cursor-pointer ${
                  color === c.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Undo / Reset / Save / Cancel */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition cursor-pointer"
            title="בטל פעולה אחרונה"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>בטל</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={history.length <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition cursor-pointer"
            title="נקה את כל הסימונים"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>נקה הכל</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAnnotated}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>שמור סימון</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-2">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="max-w-full max-h-[80vh] object-contain rounded-xl border border-slate-700 shadow-2xl cursor-crosshair touch-none bg-slate-900"
        />
      </div>
    </div>
  );
};
