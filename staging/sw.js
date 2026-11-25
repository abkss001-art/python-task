// Service Worker v9 - Fixed notification icon resolution and transparent status bar badge
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

function getAssetUrl(assetName) {
  try {
    const url = new URL(self.location.href);
    const folder = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
    return `${url.origin}${folder}${assetName}`;
  } catch {
    return `./${assetName}`;
  }
}

self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'צב מן - עדכון בדיקות';
    const body = data.body || 'יש עדכון חדש במערכת הבדיקות';
    const iconUrl = getAssetUrl('icon-192.png');
    const badgeUrl = getAssetUrl('badge-96.png');
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
