/**
 * רישום Service Worker, בקשת הרשאת התראות ושליחת התראות מערכת (Push / OS Notifications)
 * בכל פעם שעולה תקלה חדשה במערכת "צב מן"
 */

export async function registerPwaServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    return reg;
  } catch {
    return null;
  }
}

export function getNotificationPermissionState(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestAppNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    localStorage.setItem('std_qa_notifications_enabled', 'true');
    return true;
  }
  try {
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    if (granted) {
      localStorage.setItem('std_qa_notifications_enabled', 'true');
      await sendSystemNotification(
        '🔔 ההתראות ב"צב מן" הופעלו בהצלחה!',
        'מעכשיו תקבל התראה מיידית למכשיר בכל פעם שתעלה תקלה חדשה במערכת.'
      );
    }
    return granted;
  } catch {
    return false;
  }
}

export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // ignore audio restrictions
  }
}

export async function sendSystemNotification(title: string, body: string) {
  playNotificationSound();

  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon: './icon.svg',
          badge: './icon.svg',
          dir: 'rtl',
          lang: 'he',
          tag: `tzav-man-${Date.now()}`
        });
        return;
      }
    }
    new Notification(title, {
      body,
      icon: './icon.svg',
      dir: 'rtl',
      lang: 'he'
    });
  } catch {
    // ignore notification errors
  }
}
