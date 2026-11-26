export interface ScrollToTopTrackerState {
  visible: boolean;
  anchorY: number;
  lastDirection: 'up' | 'down' | null;
}

export const SCROLL_TOP_SHOW_MIN_Y = 260;
export const SCROLL_DIRECTION_THRESHOLD_PX = 16;

/**
 * Pure scroll-direction state machine with hysteresis:
 * - Always hidden near the top of the page (scrollY < minY)
 * - Shows as soon as user scrolls UP >= threshold while below minY
 * - Immediately hides if user starts scrolling DOWN >= threshold
 */
export function computeScrollToTopState(
  prev: ScrollToTopTrackerState,
  currentY: number,
  minY = SCROLL_TOP_SHOW_MIN_Y,
  threshold = SCROLL_DIRECTION_THRESHOLD_PX
): ScrollToTopTrackerState {
  const y = Math.max(0, Number.isFinite(currentY) ? currentY : 0);

  if (y < minY) {
    return { visible: false, anchorY: y, lastDirection: null };
  }

  const delta = y - prev.anchorY;

  // Scrolling downward
  if (delta > 0) {
    if (prev.lastDirection === 'down') {
      return { visible: false, anchorY: y, lastDirection: 'down' };
    }
    if (delta >= threshold) {
      return { visible: false, anchorY: y, lastDirection: 'down' };
    }
    return prev;
  }

  // Scrolling upward
  if (delta < 0) {
    if (prev.lastDirection === 'up') {
      return { visible: true, anchorY: y, lastDirection: 'up' };
    }
    if (Math.abs(delta) >= threshold) {
      return { visible: true, anchorY: y, lastDirection: 'up' };
    }
    return prev;
  }

  return prev;
}
