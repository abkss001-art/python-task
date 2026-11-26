import { useEffect, useRef, useState } from 'react';

// ============================================================================
// 1. Cross-Platform Body Scroll Lock (iOS Safari, Android Chrome, Desktop)
//    Uses a 90ms debounced unlock so switching between modals (e.g. Back from
//    AdminTeamModal -> AdminToolsModal) NEVER un-fixes body or jumps scroll!
// ============================================================================
let bodyLockCount = 0;
let isBodyCurrentlyLocked = false;
let unlockBodyTimer: number | null = null;
let savedScrollY = 0;
let prevHtmlOverflow = '';
let prevHtmlOverscrollY = '';
let prevBodyOverflow = '';
let prevBodyPosition = '';
let prevBodyTop = '';
let prevBodyLeft = '';
let prevBodyRight = '';
let prevBodyWidth = '';
let prevBodyOverscrollY = '';

function performBodyUnlockNow(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!isBodyCurrentlyLocked || bodyLockCount > 0) return;

  isBodyCurrentlyLocked = false;
  const html = document.documentElement;
  const body = document.body;

  html.style.overflow = prevHtmlOverflow;
  html.style.overscrollBehaviorY = prevHtmlOverscrollY;
  body.style.overflow = prevBodyOverflow;
  body.style.overscrollBehaviorY = prevBodyOverscrollY;
  body.style.position = prevBodyPosition;
  body.style.top = prevBodyTop;
  body.style.left = prevBodyLeft;
  body.style.right = prevBodyRight;
  body.style.width = prevBodyWidth;

  window.scrollTo(0, savedScrollY);
}

export function acquireBodyScrollLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  bodyLockCount += 1;

  // Cancel any pending unlock from a just-closed modal so modal-to-modal swaps stay rock-steady
  if (unlockBodyTimer !== null) {
    window.clearTimeout(unlockBodyTimer);
    unlockBodyTimer = null;
  }

  if (isBodyCurrentlyLocked) return;
  isBodyCurrentlyLocked = true;

  savedScrollY = window.scrollY || window.pageYOffset || 0;
  const html = document.documentElement;
  const body = document.body;

  prevHtmlOverflow = html.style.overflow;
  prevHtmlOverscrollY = html.style.overscrollBehaviorY;
  prevBodyOverflow = body.style.overflow;
  prevBodyPosition = body.style.position;
  prevBodyTop = body.style.top;
  prevBodyLeft = body.style.left;
  prevBodyRight = body.style.right;
  prevBodyWidth = body.style.width;
  prevBodyOverscrollY = body.style.overscrollBehaviorY;

  html.style.overflow = 'hidden';
  html.style.overscrollBehaviorY = 'none';
  body.style.overflow = 'hidden';
  body.style.overscrollBehaviorY = 'none';
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
}

export function releaseBodyScrollLock(immediate = false): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (bodyLockCount <= 0) return;
  bodyLockCount -= 1;
  if (bodyLockCount !== 0) return;

  if (unlockBodyTimer !== null) {
    window.clearTimeout(unlockBodyTimer);
    unlockBodyTimer = null;
  }

  if (immediate) {
    performBodyUnlockNow();
    return;
  }

  // 90ms grace prevents background jump/reflow when one modal closes and another opens immediately
  unlockBodyTimer = window.setTimeout(() => {
    unlockBodyTimer = null;
    if (bodyLockCount === 0) {
      performBodyUnlockNow();
    }
  }, 90);
}

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    acquireBodyScrollLock();
    return () => {
      releaseBodyScrollLock(false);
    };
  }, [active]);
}

// ============================================================================
// 2. Per-Level Native History Stack + Double-Back-to-Exit Guard
//    Respects Chromium History Manipulation Intervention & iOS Safari swipe-back:
//    - NEVER calls history.pushState() from popstate or a post-popstate timer!
//    - Every forward screen/modal tap pushes its own user-activated history entry.
//    - Pressing phone Back pops real entries one by one across unlimited nested levels.
//    - On the root screen, first Back pops the Exit Guard and shows a 2.5s toast
//      ("לחץ שוב כדי לצאת"); second Back within 2.5s exits the app natively.
// ============================================================================
interface BackStackEntry {
  id: number;
  seq: number;
  attachedPopId: number | null;
  invoke: () => void;
}

type ExitPromptListener = (visible: boolean) => void;

const backStack: BackStackEntry[] = [];
const exitPromptListeners = new Set<ExitPromptListener>();

let nextBackEntryId = 1;
let isInitialized = false;
let currentHistorySeq = 0;
let exitGuardSeq: number | null = null;
let suppressNextPopCount = 0;

let isPopTransitionActive = false;
let currentPopId = 0;
let popTransitionTimer: number | null = null;
let syncHistoryTimer: number | null = null;

let exitPromptActive = false;
let exitPromptTimer: number | null = null;
const DEFAULT_EXIT_PROMPT_MS = 2500;

function clearTimer(timer: number | null): null {
  if (timer !== null && typeof window !== 'undefined') {
    window.clearTimeout(timer);
  }
  return null;
}

function notifyExitPrompt(visible: boolean, durationMs = DEFAULT_EXIT_PROMPT_MS): void {
  exitPromptActive = visible;
  exitPromptTimer = clearTimer(exitPromptTimer);

  for (const listener of exitPromptListeners) {
    try {
      listener(visible);
    } catch {
      // ignore listener errors
    }
  }

  if (visible && typeof window !== 'undefined') {
    exitPromptTimer = window.setTimeout(() => {
      exitPromptTimer = null;
      exitPromptActive = false;
      for (const listener of exitPromptListeners) {
        try {
          listener(false);
        } catch {
          // ignore
        }
      }
    }, durationMs);
  }
}

function getBaseSeq(): number {
  return exitGuardSeq ?? 0;
}

function getExpectedTopSeq(): number {
  if (backStack.length > 0) {
    return backStack[backStack.length - 1].seq;
  }
  return getBaseSeq();
}

function pushManagedHistoryEntry(kind: 'exit-guard' | 'layer'): number {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') {
    return currentHistorySeq;
  }
  const nextSeq = currentHistorySeq + 1;
  try {
    window.history.pushState(
      {
        __tzvApp: true,
        __tzvSeq: nextSeq,
        __tzvKind: kind,
        __tzvBackGuard: true
      },
      ''
    );
    currentHistorySeq = nextSeq;
  } catch {
    // ignore sandboxed history errors
  }
  return currentHistorySeq;
}

function armExitGuardOnUserGesture(): void {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') return;
  if (exitGuardSeq !== null) return;
  if (currentHistorySeq !== 0 || backStack.length > 0) return;

  exitGuardSeq = pushManagedHistoryEntry('exit-guard');
}

function syncHistoryToStackNow(): void {
  if (typeof window === 'undefined' || typeof window.history === 'undefined') return;
  if (isPopTransitionActive) return;

  const targetSeq = getExpectedTopSeq();
  const delta = currentHistorySeq - targetSeq;
  if (delta > 0) {
    suppressNextPopCount += 1;
    try {
      window.history.go(-delta);
    } catch {
      suppressNextPopCount = Math.max(0, suppressNextPopCount - 1);
    }
  }
}

function scheduleHistorySync(): void {
  if (typeof window === 'undefined') return;
  syncHistoryTimer = clearTimer(syncHistoryTimer);
  // 80ms grace lets modal-to-modal forward transitions mount before collapsing excess history
  syncHistoryTimer = window.setTimeout(() => {
    syncHistoryTimer = null;
    syncHistoryToStackNow();
  }, 80);
}

function handleUserGesture(): void {
  // User is actively interacting — end any popstate transition window immediately
  if (isPopTransitionActive) {
    isPopTransitionActive = false;
    popTransitionTimer = clearTimer(popTransitionTimer);
  }
  if (exitPromptActive) {
    notifyExitPrompt(false);
  }
  armExitGuardOnUserGesture();
}

function handleWindowPopState(event: PopStateEvent): void {
  const state = (event?.state ?? window.history?.state) as
    | { __tzvApp?: boolean; __tzvSeq?: number; __tzvKind?: string }
    | null
    | undefined;
  const prevSeq = currentHistorySeq;
  const landedSeq =
    typeof state?.__tzvSeq === 'number' && Number.isFinite(state.__tzvSeq) ? state.__tzvSeq : 0;
  currentHistorySeq = landedSeq;

  if (landedSeq === 0) {
    exitGuardSeq = null;
  }

  if (suppressNextPopCount > 0) {
    suppressNextPopCount -= 1;
    return;
  }

  // Only intercept backwards navigation (ignore forward browser button)
  if (landedSeq > prevSeq) {
    return;
  }

  // Cancel any pending X-close sync while we process this Back step
  syncHistoryTimer = clearTimer(syncHistoryTimer);

  if (backStack.length > 0) {
    isPopTransitionActive = true;
    currentPopId += 1;
    popTransitionTimer = clearTimer(popTransitionTimer);
    popTransitionTimer = window.setTimeout(() => {
      popTransitionTimer = null;
      isPopTransitionActive = false;
      // Clean up any leftover excess history entries (e.g. after non-nested modal jump)
      syncHistoryToStackNow();
    }, 120);

    const top = backStack[backStack.length - 1];
    try {
      top.invoke();
    } catch {
      // never break popstate loop
    }
    return;
  }

  // Root screen (no open modals or sub-screens):
  // User just popped the Exit Guard (1 -> 0). Show "press back again to exit" toast!
  // We intentionally do NOT call pushState here so a 2nd Back press within 2.5s exits natively!
  if (prevSeq >= 1 && landedSeq === 0) {
    notifyExitPrompt(true);
  }
}

export function initMobileBackNavigation(): void {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  const existing = window.history?.state as { __tzvApp?: boolean; __tzvSeq?: number } | null;
  if (existing && existing.__tzvApp && typeof existing.__tzvSeq === 'number') {
    currentHistorySeq = existing.__tzvSeq;
    exitGuardSeq = currentHistorySeq >= 1 ? 1 : null;
  } else {
    currentHistorySeq = 0;
    exitGuardSeq = null;
    try {
      window.history.replaceState(
        {
          ...(existing && typeof existing === 'object' ? existing : {}),
          __tzvApp: true,
          __tzvSeq: 0,
          __tzvKind: 'exit-base'
        },
        ''
      );
    } catch {
      // ignore
    }
  }

  window.addEventListener('popstate', handleWindowPopState);
  window.addEventListener('pointerdown', handleUserGesture, { capture: true, passive: true });
  window.addEventListener('keydown', handleUserGesture, { capture: true, passive: true });
}

export function registerBackHandler(invoke: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  initMobileBackNavigation();

  // A new modal/screen is opening, so cancel any pending collapse from a closing modal
  syncHistoryTimer = clearTimer(syncHistoryTimer);

  if (exitPromptActive) {
    notifyExitPrompt(false);
  }

  const id = nextBackEntryId++;
  let assignedSeq: number;
  let attachedPopId: number | null = null;

  if (isPopTransitionActive) {
    // Mounting as the destination of a phone Back press (e.g. AdminTeamModal -> AdminToolsModal):
    // Attach cleanly to the existing user-activated history entry WITHOUT calling pushState!
    attachedPopId = currentPopId;
    assignedSeq = currentHistorySeq;

    // If multiple nested handlers mount in the same Back transition (e.g. AdminToolsModal dev view),
    // stagger the lower handler(s) down by 1 so in-modal Back buttons keep exact history depth.
    const minLowerSeq = getBaseSeq() + 1;
    for (let i = backStack.length - 1; i >= 0; i -= 1) {
      if (backStack[i].attachedPopId === currentPopId) {
        backStack[i].seq = Math.max(minLowerSeq, backStack[i].seq - 1);
      } else {
        break;
      }
    }
  } else {
    // Forward navigation triggered by a user tap -> push a real user-activated history entry!
    assignedSeq = pushManagedHistoryEntry('layer');
  }

  backStack.push({ id, seq: assignedSeq, attachedPopId, invoke });

  return () => {
    const idx = backStack.findIndex((e) => e.id === id);
    if (idx !== -1) {
      backStack.splice(idx, 1);
    }

    // Only collapse excess history when closed manually (X / backdrop / Cancel), NOT during popstate
    if (!isPopTransitionActive) {
      scheduleHistorySync();
    }
  };
}

export function subscribeExitPrompt(listener: ExitPromptListener): () => void {
  initMobileBackNavigation();
  exitPromptListeners.add(listener);
  return () => {
    exitPromptListeners.delete(listener);
  };
}

export function getActiveBackStackDepth(): number {
  return backStack.length;
}

export function getCurrentHistorySeqForTests(): number {
  return currentHistorySeq;
}

export function resetBackNavigationForTests(): void {
  unlockBodyTimer = clearTimer(unlockBodyTimer);
  popTransitionTimer = clearTimer(popTransitionTimer);
  syncHistoryTimer = clearTimer(syncHistoryTimer);
  exitPromptTimer = clearTimer(exitPromptTimer);

  bodyLockCount = 0;
  isBodyCurrentlyLocked = false;
  backStack.length = 0;
  exitPromptListeners.clear();
  currentHistorySeq = 0;
  exitGuardSeq = null;
  suppressNextPopCount = 0;
  isPopTransitionActive = false;
  currentPopId = 0;
  exitPromptActive = false;
  isInitialized = false;
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
 * Combined modal UX hook: locks background scrolling smoothly (iOS/Android/Desktop)
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

/**
 * Subscribes to the root-screen Double-Back-to-Exit prompt ("לחץ שוב כדי לצאת").
 */
export function useExitPromptNotice(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribeExitPrompt(setVisible);
  }, []);

  return visible;
}
