import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  computeScrollToTopState,
  ScrollToTopTrackerState
} from '../utils/scrollToTopState';

interface ScrollToTopButtonProps {
  /** Hide when any modal/drawer is open or when on screens without an issues list */
  disabled?: boolean;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const trackerRef = useRef<ScrollToTopTrackerState>({
    visible: false,
    anchorY: 0,
    lastDirection: null
  });

  useEffect(() => {
    if (disabled) {
      trackerRef.current = { visible: false, anchorY: 0, lastDirection: null };
      setVisible(false);
      return;
    }

    const initialY = window.scrollY || window.pageYOffset || 0;
    trackerRef.current = { visible: false, anchorY: initialY, lastDirection: null };

    const handleScroll = () => {
      // Ignore synthetic scroll shifts while body scroll lock (modal open) is active
      if (document.body.style.position === 'fixed') {
        if (trackerRef.current.visible) {
          trackerRef.current = { ...trackerRef.current, visible: false };
          setVisible(false);
        }
        return;
      }

      const currentY = window.scrollY || window.pageYOffset || 0;
      const next = computeScrollToTopState(trackerRef.current, currentY);
      const changed = next.visible !== trackerRef.current.visible;
      trackerRef.current = next;
      if (changed) {
        setVisible(next.visible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [disabled]);

  if (disabled || !visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        trackerRef.current = { visible: false, anchorY: 0, lastDirection: null };
        setVisible(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      aria-label="חזור לראש העמוד"
      title="חזור למעלה"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-600/95 hover:bg-indigo-700 active:scale-95 text-white shadow-xl shadow-indigo-600/35 border border-indigo-400/40 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all exit-toast-in"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
};
