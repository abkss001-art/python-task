import { useEffect, useRef } from 'react';

// ============================================================================
// 1. Cross-Platform Body Scroll Lock (iOS Safari, Android Chrome, Desktop)
// ============================================================================
let bodyLockCount = 0;
let savedScrollY = 0;
let prevHtmlOverflow = '';
let prevHtmlOverscroll = '';
let prevBodyOverflow = '';
let prevBodyPosition = '';
let prevBodyTop = '';
let prevBodyLeft = '';
let prevBodyRight = '';
let prevBodyWidth = '';
let prevBodyOverscroll = '';

export function acquireBodyScrollLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  bodyLockCount += 1;
  if (bodyLockCount !== 1) return;

  savedScrollY = window.scrollY || window.pageYOffset || 0;
  const html = document.documentElement;
  const body = document.body;

  prevHtmlOverflow = html.style.overflow;
  prevHtmlOverscroll = html.style.overscrollBehavior;
  prevBodyOverflow = body.style.overflow;
  prevBodyPosition = body.style.position;
  prevBodyTop = body.style.top;
  prevBodyLeft = body.style.left;
  prevBodyRight = body.style.right;
  prevBodyWidth = body.style.width;
  prevBodyOverscroll = body.style.overscrollBehavior;

  html.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';
  body.style.overflow = 'hidden';
  body.style.overscrollBehavior = 'none';
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
}

export function releaseBodyScrollLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (bodyLockCount <= 0) return;
  bodyLockCount -= 1;
  if (bodyLockCount !== 0) return;

  const html = document.documentElement;
  const body = document.body;

  html.style.overflow = prevHtmlOverflow;
  html.style.overscrollBehavior = prevHtmlOverscroll;
  body.style.overflow = prevBodyOverflow;
  body.style.overscrollBehavior = prevBodyOverscroll;
  body.style.position = prevBodyPosition;
  body.style.top = prevBodyTop;
  body.style.left = prevBodyLeft;
  body.style.right = prevBodyRight;
  body.style.width = prevBodyWidth;

  window.scrollTo(0, savedScrollY);
}

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    acquireBodyScrollLock();
    return () => {
      releaseBodyScrollLock();
    };
  }, [active]);
}

// ============================================================================
// 2. Mobile Hardware / Swipe-Back Stack (Android Back + iOS Swipe-Back)
// ============================================================================
interface BackStackEntry {
  id: number;
  invoke: () => void;
}

const backStack: BackStackEntry[] = [];
let nextBackEntryId = 1;
let isPopListenerAttached = false;
let suppressNextPopCount = 0;
let disarmTimer: number | null = null;
let rearmTimer: number | null = null;

function cancelPendingTimers() {
  if (disarmTimer !== null) {
    window.clearTimeout(disarmTimer);
    disarmTimer = null;
  }
  if (rearmTimer !== null) {
    window.clearTimeout(rearmTimer);
    rearmTimer = null;
  }
}

function ensureGuardArmed() {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') return;
  if (disarmTimer !== null) {
    window.clearTimeout(disarmTimer);
    disarmTimer = null;
  }
  if (window.history.state?.__tzvBackGuard !== true) {
    try {
      window.history.pushState({ ...(window.history.state || {}), __tzvBackGuard: true }, '');
    } catch {
      // ignore sandboxed history errors
    }
  }
}

function scheduleDisarmIfEmpty() {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') return;
  if (backStack.length > 0) return;
  if (disarmTimer !== null) {
    window.clearTimeout(disarmTimer);
  }
  // 80ms grace period avoids race conditions when closing one modal immediately opens another
  disarmTimer = window.setTimeout(() => {
    disarmTimer = null;
    if (backStack.length === 0 && window.history.state?.__tzvBackGuard === true) {
      suppressNextPopCount += 1;
      try {
        window.history.back();
      } catch {
        suppressNextPopCount = Math.max(0, suppressNextPopCount - 1);
      }
    }
  }, 80);
}

function handleWindowPopState() {
  if (suppressNextPopCount > 0) {
    suppressNextPopCount -= 1;
    if (backStack.length > 0) {
      ensureGuardArmed();
    }
    return;
  }
  if (backStack.length === 0) return;

  const top = backStack[backStack.length - 1];
  try {
    top.invoke();
  } catch {
    // never break history loop
  }

  // Re-arm the single history guard if another modal/screen remains open underneath
  if (rearmTimer !== null) {
    window.clearTimeout(rearmTimer);
  }
  rearmTimer = window.setTimeout(() => {
    rearmTimer = null;
    if (backStack.length > 0) {
      ensureGuardArmed();
    }
  }, 40);
}

function ensurePopStateListener() {
  if (typeof window === 'undefined' || isPopListenerAttached) return;
  window.addEventListener('popstate', handleWindowPopState);
  isPopListenerAttached = true;
}

export function registerBackHandler(invoke: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  ensurePopStateListener();
  const id = nextBackEntryId++;
  backStack.push({ id, invoke });
  ensureGuardArmed();

  return () => {
    const idx = backStack.findIndex((e) => e.id === id);
    if (idx !== -1) {
      backStack.splice(idx, 1);
    }
    if (backStack.length === 0) {
      scheduleDisarmIfEmpty();
    } else if (window.history.state?.__tzvBackGuard !== true) {
      ensureGuardArmed();
    }
  };
}

export function getActiveBackStackDepth(): number {
  return backStack.length;
}

export function resetBackNavigationForTests(): void {
  cancelPendingTimers();
  backStack.length = 0;
  suppressNextPopCount = 0;
}

/**
 * Hooks into mobile Android Back button & iOS swipe-back while `active` is true.
 * LIFO order guarantees nested dialogs / Lightbox close before their parent modal.
 */
export function useMobileBackHandler(active: boolean, onBack: () => void): void {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;
    return registerBackHandler(() => {
      onBackRef.current();
    });
  }, [active]);
}

/**
 * Combined modal UX hook: locks background scrolling (iOS/Android/Desktop)
 * AND maps phone Back button / swipe-back to `onBack`.
 */
export function useModalUx(
  active: boolean,
  onBack: () => void,
  options: { lockScroll?: boolean } = {}
): void {
  const shouldLock = options.lockScroll !== false;
  useBodyScrollLock(active && shouldLock);
  useMobileBackHandler(active, onBack);
}
