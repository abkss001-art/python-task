// Service Worker v8 - Force immediate update, crisp notification badges & cache cleanup
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'צב מן - עדכון בדיקות';
    const body = data.body || 'יש עדכון חדש במערכת הבדיקות';
    const iconUrl = new URL('icon-192.png', self.location.href).href;
    const badgeUrl = new URL('badge-96.png', self.location.href).href;
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: iconUrl,
        badge: badgeUrl,
        dir: 'rtl',
        lang: 'he',
        tag: `tzav-man-${Date.now()}`
      })
    );
  } catch {
    // ignore push errors
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});
